import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, CheckCircle2, RefreshCw, Sliders, Sparkles } from 'lucide-react';
import { FACIAL_CHALLENGES } from '../data/curriculum';
import { FacialChallenge, StudentProgressState } from '../types/learning';

interface FacialPracticeStudioProps {
  progress: StudentProgressState;
  onCompleteChallenge: (challengeId: string, score: number) => void;
  initialChallengeId?: string;
}

interface LiveMetrics {
  eyebrowArch: number; // -1.0 to +1.0
  mouthSmile: number; // 0.0 to 1.0
  mouthOpen: number; // 0.0 to 1.0
  headTiltDeg: number; // -15 to +15
}

export const FacialPracticeStudio: React.FC<FacialPracticeStudioProps> = ({
  progress,
  onCompleteChallenge,
  initialChallengeId
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<FacialChallenge>(() => {
    if (initialChallengeId) {
      const found = FACIAL_CHALLENGES.find((c) => c.id === initialChallengeId);
      if (found) return found;
    }
    return FACIAL_CHALLENGES[0];
  });

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualSimulationMode, setManualSimulationMode] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<LiveMetrics>({
    eyebrowArch: 0.1,
    mouthSmile: 0.25,
    mouthOpen: 0.15,
    headTiltDeg: 0
  });

  const [holdSeconds, setHoldSeconds] = useState<number>(0);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Baseline luminance values captured on calibration
  const baselineRef = useRef<{
    browRatio: number;
    mouthSmileRatio: number;
    mouthOpenRatio: number;
    calibrated: boolean;
  }>({
    browRatio: 1.0,
    mouthSmileRatio: 1.0,
    mouthOpenRatio: 1.0,
    calibrated: false
  });

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setManualSimulationMode(false);
    } catch {
      setCameraActive(false);
      setManualSimulationMode(true);
      setCameraError(
        'No se pudo acceder a la cámara del dispositivo. Se ha activado el Simulador Interactivo de Expresión Facial para que puedas practicar igualmente.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Evaluate whether current metrics satisfy the selected facial challenge
  const isTargetMet = React.useMemo(() => {
    const t = selectedChallenge.thresholds;
    if (t.minEyebrowArch !== undefined && metrics.eyebrowArch < t.minEyebrowArch) return false;
    if (t.maxEyebrowArch !== undefined && metrics.eyebrowArch > t.maxEyebrowArch) return false;
    if (t.minMouthSmile !== undefined && metrics.mouthSmile < t.minMouthSmile) return false;
    if (t.minMouthOpen !== undefined && metrics.mouthOpen < t.minMouthOpen) return false;
    return true;
  }, [metrics, selectedChallenge]);

  // Hold timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!cameraActive && !manualSimulationMode) return;
      if (isTargetMet) {
        setHoldSeconds((prev) => {
          const next = Number((prev + 0.1).toFixed(1));
          if (next >= selectedChallenge.holdSecondsRequired) {
            return selectedChallenge.holdSecondsRequired;
          }
          return next;
        });
      } else {
        setHoldSeconds((prev) => Math.max(0, Number((prev - 0.15).toFixed(1))));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isTargetMet, cameraActive, manualSimulationMode, selectedChallenge.holdSecondsRequired]);

  // Handle completion when hold time is reached
  useEffect(() => {
    if (
      holdSeconds >= selectedChallenge.holdSecondsRequired &&
      justCompletedId !== selectedChallenge.id
    ) {
      setJustCompletedId(selectedChallenge.id);
      const timer = setTimeout(() => {
        onCompleteChallenge(selectedChallenge.id, 96);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [holdSeconds, selectedChallenge, justCompletedId, onCompleteChallenge]);

  // Reset hold progress when switching challenge
  const handleSelectChallenge = (challenge: FacialChallenge) => {
    setSelectedChallenge(challenge);
    setHoldSeconds(0);
    setJustCompletedId(null);
  };

  // Real-time optical facial region analysis loop when camera is active
  useEffect(() => {
    if (!cameraActive) return;

    if (!offscreenCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = 160;
      c.height = 120;
      offscreenCanvasRef.current = c;
    }

    let rafId: number;
    let lastSampleTime = 0;

    const processVideoFrame = (timestamp: number) => {
      const video = videoRef.current;
      const overlay = overlayCanvasRef.current;
      const offscreen = offscreenCanvasRef.current;

      if (video && overlay && offscreen && video.readyState >= 2) {
        if (timestamp - lastSampleTime > 90) {
          lastSampleTime = timestamp;
          const oCtx = offscreen.getContext('2d', { willReadFrequently: true });
          if (oCtx) {
            oCtx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
            const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;

            // Compute regional vertical gradient / luminance ratios inside the face guide box
            const foreheadLum = sampleRegionLuminance(imgData, 160, 58, 30, 44, 12);
            const browLum = sampleRegionLuminance(imgData, 160, 58, 42, 44, 10);
            const cheekLum = sampleRegionLuminance(imgData, 160, 54, 62, 52, 12);
            const mouthCenterLum = sampleRegionLuminance(imgData, 160, 66, 76, 28, 12);
            const mouthOuterLum = sampleRegionLuminance(imgData, 160, 52, 74, 56, 12);
            const leftFaceLum = sampleRegionLuminance(imgData, 160, 50, 48, 24, 30);
            const rightFaceLum = sampleRegionLuminance(imgData, 160, 86, 48, 24, 30);

            const currentBrowRatio = (foreheadLum + 1) / (browLum + 1);
            const currentSmileRatio = (cheekLum + 1) / (mouthOuterLum + 1);
            const currentOpenRatio = (cheekLum + 1) / (mouthCenterLum + 1);

            if (!baselineRef.current.calibrated) {
              baselineRef.current = {
                browRatio: currentBrowRatio,
                mouthSmileRatio: currentSmileRatio,
                mouthOpenRatio: currentOpenRatio,
                calibrated: true
              };
            }

            const browDelta = (currentBrowRatio - baselineRef.current.browRatio) * 5.2;
            const smileDelta = (currentSmileRatio - baselineRef.current.mouthSmileRatio) * 4.5;
            const openDelta = (currentOpenRatio - baselineRef.current.mouthOpenRatio) * 4.2;
            const tiltEstimate = ((leftFaceLum - rightFaceLum) / 255) * 28;

            setMetrics((prev) => ({
              eyebrowArch: Number(
                Math.max(-1, Math.min(1, prev.eyebrowArch * 0.65 + browDelta * 0.35)).toFixed(2)
              ),
              mouthSmile: Number(
                Math.max(0, Math.min(1, prev.mouthSmile * 0.65 + (0.35 + smileDelta) * 0.35)).toFixed(2)
              ),
              mouthOpen: Number(
                Math.max(0, Math.min(1, prev.mouthOpen * 0.65 + (0.2 + openDelta) * 0.35)).toFixed(2)
              ),
              headTiltDeg: Number(
                Math.max(-15, Math.min(15, prev.headTiltDeg * 0.7 + tiltEstimate * 0.3)).toFixed(1)
              )
            }));
          }
        }

        // Draw facial landmark guide overlay
        const ctx = overlay.getContext('2d');
        if (ctx) {
          drawCameraBiometricOverlay(ctx, overlay.width, overlay.height, metrics, isTargetMet);
        }
      }

      rafId = requestAnimationFrame(processVideoFrame);
    };

    rafId = requestAnimationFrame(processVideoFrame);
    return () => cancelAnimationFrame(rafId);
  }, [cameraActive, metrics, isTargetMet]);

  const handleCalibrateNeutral = () => {
    baselineRef.current.calibrated = false;
    setHoldSeconds(0);
  };

  const applyPresetExpression = () => {
    setManualSimulationMode(true);
    if (selectedChallenge.targetExpression === 'sonrisa_afectiva') {
      setMetrics({ eyebrowArch: 0.25, mouthSmile: 0.78, mouthOpen: 0.2, headTiltDeg: 3 });
    } else if (selectedChallenge.targetExpression === 'cejas_elevadas_pregunta') {
      setMetrics({ eyebrowArch: 0.75, mouthSmile: 0.3, mouthOpen: 0.25, headTiltDeg: 6 });
    } else if (selectedChallenge.targetExpression === 'cejas_fruncidas_wh') {
      setMetrics({ eyebrowArch: -0.62, mouthSmile: 0.1, mouthOpen: 0.25, headTiltDeg: -4 });
    } else {
      setMetrics({ eyebrowArch: 0.72, mouthSmile: 0.45, mouthOpen: 0.75, headTiltDeg: 0 });
    }
  };

  const holdPercent = Math.min(
    100,
    Math.round((holdSeconds / selectedChallenge.holdSecondsRequired) * 100)
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-mono text-slate-500 mb-1">
            LABORATORIO DE EXPRESIÓN FACIAL · MARCADORES NO MANUALES (MNM)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Reconocimiento Facial en Tiempo Real
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            En la lengua de signos, las cejas, la apertura bucal y la inclinación de la cabeza constituyen la gramática visual. Activa tu cámara para practicar cada marcador en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {!cameraActive ? (
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-4 h-4" />
              <span>Activar Cámara en Vivo</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCalibrateNeutral}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Calibrar Rostro Neutro</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>Detener Cámara</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setManualSimulationMode((m) => !m)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              manualSimulationMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador Manual</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
          <span>{cameraError}</span>
          <button
            type="button"
            onClick={applyPresetExpression}
            className="px-3 py-1.5 bg-amber-800 text-white rounded-md font-semibold whitespace-nowrap cursor-pointer"
          >
            Probar Expresión Objetivo
          </button>
        </div>
      )}

      {/* Two-Zone Educational Sandbox Layout (65% Stage Left / 35% Control & Concept Deck Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Left Interactive Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            {/* Live Camera Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? 'block' : 'hidden'
              }`}
            />

            {/* Biometric Overlay Canvas when camera is active */}
            {cameraActive && (
              <canvas
                ref={overlayCanvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}

            {/* Interactive Sculpted Expressive Portrait Stage when camera is off */}
            {!cameraActive && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                <svg
                  viewBox="0 0 240 220"
                  className="w-52 h-44 mb-3"
                  aria-label="Previsualización anatómica de expresión facial"
                >
                  <defs>
                    <radialGradient id="portraitFaceGrad" cx="45%" cy="38%" r="60%">
                      <stop offset="0%" stopColor="#fde4cf" />
                      <stop offset="65%" stopColor="#f3c19d" />
                      <stop offset="100%" stopColor="#d99b72" />
                    </radialGradient>
                  </defs>

                  {/* Studio Aura */}
                  <circle
                    cx="120"
                    cy="108"
                    r="86"
                    fill="none"
                    stroke={isTargetMet ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.22)'}
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />

                  {/* Neck & Shoulders */}
                  <path d="M62 212 C68 178, 92 168, 120 168 C148 168, 172 178, 178 212 Z" fill="#0f365c" />
                  <rect x="104" y="148" width="32" height="28" rx="8" fill="url(#portraitFaceGrad)" />

                  {/* Ears */}
                  <ellipse cx="61" cy="108" rx="8" ry="16" fill="#e4ab83" />
                  <ellipse cx="179" cy="108" rx="8" ry="16" fill="#e4ab83" />

                  {/* Sculpted Head & Jawline */}
                  <path
                    d="M64 90 C62 42, 178 42, 176 90 C175 132, 154 162, 120 172 C86 162, 65 132, 64 90 Z"
                    fill="url(#portraitFaceGrad)"
                    stroke={isTargetMet ? '#10b981' : '#38bdf8'}
                    strokeWidth="2.5"
                  />

                  {/* Layered Hair Crown */}
                  <path
                    d="M60 96 C56 46, 86 26, 124 28 C160 28, 184 50, 180 96 C172 70, 150 56, 114 54 C86 54, 68 70, 60 96 Z"
                    fill="#18181b"
                  />

                  {/* Dynamic Eyebrows responding to metrics.eyebrowArch */}
                  <path
                    d={`M 80 ${82 - metrics.eyebrowArch * 12} Q 96 ${
                      72 - metrics.eyebrowArch * 15
                    } 109 ${82 - metrics.eyebrowArch * 6}`}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M 160 ${82 - metrics.eyebrowArch * 12} Q 144 ${
                      72 - metrics.eyebrowArch * 15
                    } 131 ${82 - metrics.eyebrowArch * 6}`}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />

                  {/* Almond Eyes with Irises & Catchlights */}
                  <g transform="translate(95, 96)">
                    <path d="M-12 0 Q0 -8 12 0 Q0 7 -12 0 Z" fill="#ffffff" />
                    <circle cx="0" cy="0" r="5" fill="#4f3222" />
                    <circle cx="0" cy="0" r="2.4" fill="#09090b" />
                    <circle cx="1.6" cy="-1.6" r="1.3" fill="#ffffff" />
                    <path d="M-13 0.5 Q0 -8.5 13 0.5" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                  </g>
                  <g transform="translate(145, 96)">
                    <path d="M-12 0 Q0 -8 12 0 Q0 7 -12 0 Z" fill="#ffffff" />
                    <circle cx="0" cy="0" r="5" fill="#4f3222" />
                    <circle cx="0" cy="0" r="2.4" fill="#09090b" />
                    <circle cx="1.6" cy="-1.6" r="1.3" fill="#ffffff" />
                    <path d="M-13 0.5 Q0 -8.5 13 0.5" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
                  </g>

                  {/* Nose Bridge */}
                  <path
                    d="M118 96 Q116 112 115 118 Q120 122 125 118"
                    fill="none"
                    stroke="#a66c49"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Expressive Lips responding to metrics.mouthSmile & metrics.mouthOpen */}
                  <path
                    d={`M 96 ${138 - metrics.mouthSmile * 5} Q 120 ${
                      138 + metrics.mouthSmile * 16
                    } 144 ${138 - metrics.mouthSmile * 5} Q 120 ${
                      138 + metrics.mouthSmile * 16 + Math.max(4, metrics.mouthOpen * 24)
                    } 96 ${138 - metrics.mouthSmile * 5}`}
                    fill={metrics.mouthOpen > 0.2 ? '#7f1d1d' : '#c86d6d'}
                    stroke="#9f3e46"
                    strokeWidth="2.6"
                  />
                </svg>

                <p className="text-xs text-slate-300 max-w-md mb-3">
                  {manualSimulationMode
                    ? 'Modo Simulador Activo: Ajusta los controles deslizantes debajo o pulsa "Autocompletar Expresión" para comprobar la gramática visual.'
                    : 'Activa tu cámara web para analizar tus cejas y expresión facial en tiempo real, o utiliza el Simulador Manual.'}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors cursor-pointer"
                  >
                    Encender Cámara Ahora
                  </button>
                  <button
                    type="button"
                    onClick={applyPresetExpression}
                    className="px-4 py-2 text-xs font-semibold bg-slate-800 text-sky-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Simular Expresión Objetivo
                  </button>
                </div>
              </div>
            )}

            {/* Status HUD Bar */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-200">
                {isTargetMet ? (
                  <span className="text-emerald-400 font-semibold">
                    ● EXPRESIÓN GRAMATICAL DETECTADA — MANTÉN LA POSTURA ({holdSeconds}s /{' '}
                    {selectedChallenge.holdSecondsRequired}s)
                  </span>
                ) : (
                  <span className="text-amber-300">
                    ▲ AJUSTA TU ROSTRO SEGÚN LA PAUTA: {selectedChallenge.title.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-emerald-500 transition-all duration-100"
                  style={{ width: `${holdPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Bars */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Parámetros Faciales Detectados en Tiempo Real
              </h2>
              <button
                type="button"
                onClick={applyPresetExpression}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autocompletar Expresión Objetivo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Parameter 1: Eyebrow Arch */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Arco Supraciliar (Cejas)</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {metrics.eyebrowArch > 0 ? `+${metrics.eyebrowArch}` : metrics.eyebrowArch} rad
                  </span>
                </div>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={metrics.eyebrowArch}
                  onChange={(e) => {
                    setManualSimulationMode(true);
                    setMetrics((m) => ({ ...m, eyebrowArch: parseFloat(e.target.value) }));
                  }}
                  aria-label="Arco Supraciliar Cejas"
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Ceño (-1.0)</span>
                  <span>Neutro (0)</span>
                  <span>Elevadas (+1.0)</span>
                </div>
              </div>

              {/* Parameter 2: Mouth Smile */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Sonrisa Afectiva</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {Math.round(metrics.mouthSmile * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={metrics.mouthSmile}
                  onChange={(e) => {
                    setManualSimulationMode(true);
                    setMetrics((m) => ({ ...m, mouthSmile: parseFloat(e.target.value) }));
                  }}
                  aria-label="Sonrisa Afectiva"
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Serio (0%)</span>
                  <span>Cordial (50%)</span>
                  <span>Plena (100%)</span>
                </div>
              </div>

              {/* Parameter 3: Mouth Openness */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Apertura Vocal / Asombro</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {Math.round(metrics.mouthOpen * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={metrics.mouthOpen}
                  onChange={(e) => {
                    setManualSimulationMode(true);
                    setMetrics((m) => ({ ...m, mouthOpen: parseFloat(e.target.value) }));
                  }}
                  aria-label="Apertura Vocal"
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Cerrada (0%)</span>
                  <span>Media (50%)</span>
                  <span>Exclamación (100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Control & Concept Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Challenge Selector List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Ejercicios de Gramática Facial
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Selecciona un marcador no manual y mantén la expresión durante 2.5 segundos para superar el reto.
            </p>

            <div className="space-y-2.5">
              {FACIAL_CHALLENGES.map((challenge, idx) => {
                const isSelected = challenge.id === selectedChallenge.id;
                const isDone = progress.completedFacialChallenges.includes(challenge.id);
                return (
                  <button
                    key={challenge.id}
                    type="button"
                    onClick={() => handleSelectChallenge(challenge)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-600 text-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                      <span>
                        Ejercicio 0{idx + 1} · Nivel {challenge.level}
                      </span>
                      <span className="font-mono font-semibold text-slate-700">
                        {isDone ? '✓ Superado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{challenge.title}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{challenge.grammarFunction}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Challenge Pedagogical Detail Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="text-xs font-mono text-sky-700 mb-1">
              PAUTA DE EJECUCIÓN · NIVEL {selectedChallenge.level.toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{selectedChallenge.title}</h3>
            <p className="text-sm text-slate-700 mt-2 leading-relaxed">
              {selectedChallenge.instruction}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <div>
                <strong className="text-slate-900">Valor lingüístico:</strong>{' '}
                {selectedChallenge.linguisticContext}
              </div>
            </div>

            {progress.completedFacialChallenges.includes(selectedChallenge.id) && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ¡Excelente! Has completado y registrado este marcador facial en tu progreso.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function sampleRegionLuminance(
  data: Uint8ClampedArray,
  width: number,
  startX: number,
  startY: number,
  boxW: number,
  boxH: number
): number {
  let sum = 0;
  let count = 0;
  for (let y = startY; y < startY + boxH; y++) {
    for (let x = startX; x < startX + boxW; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx] || 0;
      const g = data[idx + 1] || 0;
      const b = data[idx + 2] || 0;
      sum += 0.299 * r + 0.587 * g + 0.114 * b;
      count++;
    }
  }
  return count > 0 ? sum / count : 128;
}

function drawCameraBiometricOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  metrics: LiveMetrics,
  isTargetMet: boolean
) {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  ctx.save();
  ctx.strokeStyle = isTargetMet ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.75)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  // Face oval target zone
  ctx.beginPath();
  ctx.ellipse(cx, cy - 10, 115, 148, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyebrow tracking bar
  const browY = cy - 58 - metrics.eyebrowArch * 14;
  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 65, browY);
  ctx.quadraticCurveTo(cx - 38, browY - 10, cx - 16, browY);
  ctx.moveTo(cx + 16, browY);
  ctx.quadraticCurveTo(cx + 38, browY - 10, cx + 65, browY);
  ctx.stroke();

  // Mouth tracking contour
  const mouthY = cy + 62;
  const smileOffset = metrics.mouthSmile * 14;
  ctx.beginPath();
  ctx.moveTo(cx - 42, mouthY - smileOffset * 0.3);
  ctx.quadraticCurveTo(cx, mouthY + smileOffset, cx + 42, mouthY - smileOffset * 0.3);
  ctx.stroke();

  ctx.restore();
}
