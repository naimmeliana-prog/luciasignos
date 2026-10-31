import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, FlipHorizontal, Eye, Download } from 'lucide-react';
import { Lesson, SignAnimationKeyframe } from '../types/learning';

interface SignVideoPlayerProps {
  lesson: Lesson;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const SignVideoPlayer: React.FC<SignVideoPlayerProps> = ({ lesson }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isRecordingClip, setIsRecordingClip] = useState<boolean>(false);

  const animationStateRef = useRef<{
    elapsedMs: number;
    lastTimestamp: number | null;
  }>({
    elapsedMs: 0,
    lastTimestamp: null
  });

  const keyframes = lesson.keyframes;
  const totalDurationMs = keyframes.reduce((acc, kf) => acc + kf.durationMs, 0);

  // Reset elapsed time when lesson changes
  useEffect(() => {
    animationStateRef.current.elapsedMs = 0;
    animationStateRef.current.lastTimestamp = null;
    setActivePhaseIndex(0);
    setProgressPercent(0);
    setIsPlaying(true);
  }, [lesson.id]);

  useEffect(() => {
    let rafId: number;

    const renderFrame = (timestamp: number) => {
      const state = animationStateRef.current;
      if (state.lastTimestamp === null) {
        state.lastTimestamp = timestamp;
      }
      const delta = timestamp - state.lastTimestamp;
      state.lastTimestamp = timestamp;

      if (isPlaying && totalDurationMs > 0) {
        state.elapsedMs = (state.elapsedMs + delta * playbackSpeed) % totalDurationMs;
      }

      // Compute active keyframe and interpolation factor
      let accumulated = 0;
      let currentIdx = 0;
      let localT = 0;

      for (let i = 0; i < keyframes.length; i++) {
        const kfDur = keyframes[i].durationMs;
        if (state.elapsedMs <= accumulated + kfDur || i === keyframes.length - 1) {
          currentIdx = i;
          localT = Math.min(1, Math.max(0, (state.elapsedMs - accumulated) / kfDur));
          break;
        }
        accumulated += kfDur;
      }

      const nextIdx = (currentIdx + 1) % keyframes.length;
      const smoothT = easeInOutCubic(localT);

      setActivePhaseIndex(currentIdx);
      setProgressPercent(Math.round((state.elapsedMs / totalDurationMs) * 100));

      const kfA: SignAnimationKeyframe = keyframes[currentIdx];
      const kfB: SignAnimationKeyframe = keyframes[nextIdx];

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawInstructorFrame(ctx, canvas.width, canvas.height, kfA, kfB, smoothT, {
            mirrorMode,
            showVectors,
            lessonNumber: lesson.number,
            lessonTitle: lesson.title,
            phaseLabel: kfA.phaseLabel
          });
        }
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, playbackSpeed, mirrorMode, showVectors, keyframes, totalDurationMs, lesson]);

  const handleScrubToPhase = (index: number) => {
    let acc = 0;
    for (let i = 0; i < index; i++) {
      acc += keyframes[i].durationMs;
    }
    animationStateRef.current.elapsedMs = acc + 50;
    setActivePhaseIndex(index);
    setProgressPercent(Math.round((acc / totalDurationMs) * 100));
  };

  const handleRestart = () => {
    animationStateRef.current.elapsedMs = 0;
    animationStateRef.current.lastTimestamp = null;
    setActivePhaseIndex(0);
    setProgressPercent(0);
    setIsPlaying(true);
  };

  const handleDownloadWebmVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecordingClip) return;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      });
      const chunks: BlobPart[] = [];
      setIsRecordingClip(true);
      handleRestart();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signaviva-leccion-${lesson.number}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecordingClip(false);
      };

      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, Math.min(totalDurationMs, 5500));
    } catch {
      setIsRecordingClip(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-sm">
      {/* Embedded Video Canvas Viewport */}
      <div className="relative aspect-video w-full bg-slate-950">
        <canvas
          ref={canvasRef}
          width={860}
          height={484}
          className="w-full h-full object-contain block"
          aria-label={`Demostración en vídeo interactivo para ${lesson.title}`}
        />

        {/* Top-left quiet instructional overlay */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur px-3 py-1.5 rounded border border-slate-700/80 text-xs text-slate-200 font-mono">
            <span>LECCIÓN {lesson.number}</span>
            <span className="mx-2 text-slate-500">·</span>
            <span>{mirrorMode ? 'PERSPECTIVA ESPEJO' : 'PERSPECTIVA FRONTAL'}</span>
          </div>
          <div className="bg-slate-900/85 backdrop-blur px-3 py-1.5 rounded border border-slate-700/80 text-xs text-sky-300 font-mono tabular-nums">
            {keyframes[activePhaseIndex]?.phaseLabel}
          </div>
        </div>
      </div>

      {/* Timeline Phase Stepper */}
      <div className="px-4 pt-3 pb-2 bg-slate-900 border-t border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {keyframes.map((kf, idx) => {
            const isCurrent = idx === activePhaseIndex;
            return (
              <button
                key={kf.phaseLabel}
                type="button"
                onClick={() => handleScrubToPhase(idx)}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer border ${
                  isCurrent
                    ? 'bg-sky-950/90 border-sky-500/70 text-white font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="font-mono text-[11px] text-sky-400 tabular-nums">
                  Paso 0{idx + 1}
                </div>
                <div className="truncate mt-0.5">{kf.phaseLabel.replace(/^Fase \d+:\s*/, '')}</div>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-sky-500 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Control Deck */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Reiniciar secuencia"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            {/* Playback Speed Segmented Selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {[0.5, 0.75, 1, 1.25].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 text-xs font-mono tabular-nums rounded-md transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMirrorMode((m) => !m)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mirrorMode
                  ? 'bg-teal-950 border-teal-500 text-teal-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>Modo Espejo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowVectors((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showVectors
                  ? 'bg-sky-950 border-sky-500/80 text-sky-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Guías Visuales</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadWebmVideo}
              disabled={isRecordingClip}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isRecordingClip ? 'Grabando Clip...' : 'Guardar Vídeo WebM'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function drawInstructorFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  kfA: SignAnimationKeyframe,
  kfB: SignAnimationKeyframe,
  t: number,
  options: {
    mirrorMode: boolean;
    showVectors: boolean;
    lessonNumber: string;
    lessonTitle: string;
    phaseLabel: string;
  }
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Studio background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle spatial signing grid (Signing Space Frame)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  ctx.lineWidth = 1;
  const gridStep = 48;
  for (let x = 0; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Neutral signing space boundary ring
  if (options.showVectors) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width * 0.24, height * 0.14, width * 0.52, height * 0.76);
    ctx.restore();
  }

  // Apply mirror transform if enabled
  if (options.mirrorMode) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  const centerX = width * 0.5;
  const headY = height * 0.31;

  // Interpolated facial & postural parameters
  const eyebrowArch = lerp(kfA.eyebrowArch, kfB.eyebrowArch, t);
  const mouthOpen = lerp(kfA.mouthOpen, kfB.mouthOpen, t);
  const mouthSmile = lerp(kfA.mouthSmile, kfB.mouthSmile, t);
  const headTiltDeg = lerp(kfA.headTilt, kfB.headTilt, t);

  // Torso / Shoulders
  ctx.save();
  ctx.fillStyle = '#1e3a5f';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 140, height);
  ctx.quadraticCurveTo(centerX - 130, height * 0.56, centerX - 60, height * 0.52);
  ctx.lineTo(centerX + 60, height * 0.52);
  ctx.quadraticCurveTo(centerX + 130, height * 0.56, centerX + 140, height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Neck
  ctx.fillStyle = '#f1c27d';
  ctx.fillRect(centerX - 22, height * 0.43, 44, 48);
  ctx.restore();

  // Head & Expressive Face (Non-Manual Markers)
  ctx.save();
  ctx.translate(centerX, headY);
  ctx.rotate((headTiltDeg * Math.PI) / 180);

  // Head oval
  ctx.fillStyle = '#ffdbac';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 56, 68, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair silhouette
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, -14, 58, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-20, -6, 4.5, 0, Math.PI * 2);
  ctx.arc(20, -6, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Dynamic Eyebrows (Crucial for Sign Language Grammar!)
  const browOffsetY = -22 - eyebrowArch * 10;
  const browInnerTilt = eyebrowArch * -5;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Left eyebrow
  ctx.beginPath();
  ctx.moveTo(-34, browOffsetY + 3);
  ctx.quadraticCurveTo(-20, browOffsetY - 4, -8, browOffsetY + browInnerTilt);
  ctx.stroke();

  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(34, browOffsetY + 3);
  ctx.quadraticCurveTo(20, browOffsetY - 4, 8, browOffsetY + browInnerTilt);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#c68642';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(-4, 12);
  ctx.lineTo(3, 14);
  ctx.stroke();

  // Mouth (Smile + Aperture for labialization)
  const mouthY = 30;
  const smileCurve = mouthSmile * 12;
  const openHeight = mouthOpen * 16;

  ctx.strokeStyle = '#991b1b';
  ctx.fillStyle = '#7f1d1d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, mouthY - smileCurve * 0.3);
  ctx.quadraticCurveTo(0, mouthY + smileCurve, 18, mouthY - smileCurve * 0.3);
  if (openHeight > 3) {
    ctx.quadraticCurveTo(0, mouthY + smileCurve + openHeight, -18, mouthY - smileCurve * 0.3);
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();

  // Interpolated Left & Right Hands
  const leftX = lerp(kfA.leftHand.x, kfB.leftHand.x, t) * width;
  const leftY = lerp(kfA.leftHand.y, kfB.leftHand.y, t) * height;
  const leftRot = lerp(kfA.leftHand.rotation, kfB.leftHand.rotation, t);
  const leftSpread = lerp(kfA.leftHand.fingerSpread, kfB.leftHand.fingerSpread, t);

  const rightX = lerp(kfA.rightHand.x, kfB.rightHand.x, t) * width;
  const rightY = lerp(kfA.rightHand.y, kfB.rightHand.y, t) * height;
  const rightRot = lerp(kfA.rightHand.rotation, kfB.rightHand.rotation, t);
  const rightSpread = lerp(kfA.rightHand.fingerSpread, kfB.rightHand.fingerSpread, t);

  // Arms connecting shoulders to hands
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left arm
  ctx.beginPath();
  ctx.moveTo(centerX - 95, height * 0.58);
  ctx.quadraticCurveTo(centerX - 115, height * 0.75, leftX, leftY);
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(centerX + 95, height * 0.58);
  ctx.quadraticCurveTo(centerX + 115, height * 0.72, rightX, rightY);
  ctx.stroke();

  // Draw Trajectory Arrow if showVectors is enabled
  if (options.showVectors && kfA.motionArrow) {
    const { fromX, fromY, toX, toY, type } = kfA.motionArrow;
    const sx = fromX * width;
    const sy = fromY * height;
    const ex = toX * width;
    const ey = toY * height;

    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    if (type === 'arc') {
      const cx = (sx + ex) / 2;
      const cy = Math.min(sy, ey) - 42;
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cx, cy, ex, ey);
    } else {
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
    }
    ctx.stroke();

    // Arrowhead
    ctx.setLineDash([]);
    const angle = Math.atan2(ey - sy, ex - sx);
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - 12 * Math.cos(angle - Math.PI / 6), ey - 12 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(ex - 12 * Math.cos(angle + Math.PI / 6), ey - 12 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw articulated hands
  drawArticulatedHand(ctx, leftX, leftY, leftRot, leftSpread, false);
  drawArticulatedHand(ctx, rightX, rightY, rightRot, rightSpread, true);

  ctx.restore();

  // Draw un-mirrored labels for hands if showVectors is enabled
  if (options.showVectors) {
    const displayRightX = options.mirrorMode ? width - rightX : rightX;
    const displayLeftX = options.mirrorMode ? width - leftX : leftX;

    drawHandBadge(ctx, displayRightX, rightY + 46, kfA.rightHand.shapeLabel, '#0284c7');
    drawHandBadge(ctx, displayLeftX, leftY + 46, kfA.leftHand.shapeLabel, '#475569');
  }
}

function drawArticulatedHand(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotationDeg: number,
  fingerSpread: number,
  isDominant: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotationDeg * Math.PI) / 180);

  // Subtle highlight glow around dominant hand
  if (isDominant) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.beginPath();
    ctx.arc(0, -6, 36, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffdbac';
  ctx.strokeStyle = isDominant ? '#0284c7' : '#334155';
  ctx.lineWidth = 2;

  // Palm
  ctx.beginPath();
  ctx.roundRect(-16, -12, 32, 28, 8);
  ctx.fill();
  ctx.stroke();

  // 4 Fingers extending based on fingerSpread (0 = closed fist, 1 = open spread)
  const fingerLen = 10 + fingerSpread * 22;
  const spreadAngle = fingerSpread * 0.16;

  for (let i = 0; i < 4; i++) {
    const offsetIdx = i - 1.5;
    ctx.save();
    ctx.translate(offsetIdx * 7, -10);
    ctx.rotate(offsetIdx * spreadAngle);
    ctx.beginPath();
    ctx.roundRect(-3.2, -fingerLen, 6.4, fingerLen, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Thumb
  ctx.save();
  const thumbAngle = -0.45 - fingerSpread * 0.45;
  ctx.translate(-15, -2);
  ctx.rotate(thumbAngle);
  ctx.beginPath();
  ctx.roundRect(-3.5, -18, 7, 18, 3.5);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawHandBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  bgColor: string
) {
  ctx.save();
  ctx.font = '600 11px "IBM Plex Mono", monospace';
  const paddingX = 8;
  const metrics = ctx.measureText(text);
  const boxW = metrics.width + paddingX * 2;
  const boxH = 22;

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(x - boxW / 2, y - boxH / 2, boxW, boxH, 4);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}
