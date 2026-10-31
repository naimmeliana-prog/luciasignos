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
      <div className="relative aspect-video w-full bg-slate-950">
        <canvas
          ref={canvasRef}
          width={860}
          height={484}
          className="w-full h-full object-contain block"
          aria-label={`Demostración en vídeo interactivo para ${lesson.title}`}
        />

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

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-sky-500 transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

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

  // Studio Backdrop with warm radial spotlight
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    40,
    width * 0.5,
    height * 0.5,
    width * 0.65
  );
  bgGrad.addColorStop(0, '#1e293b');
  bgGrad.addColorStop(0.65, '#0f172a');
  bgGrad.addColorStop(1, '#080d1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural studio horizon grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
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
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.20)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width * 0.23, height * 0.12, width * 0.54, height * 0.78);
    ctx.restore();
  }

  if (options.mirrorMode) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  const centerX = width * 0.5;
  const headY = height * 0.30;

  const eyebrowArch = lerp(kfA.eyebrowArch, kfB.eyebrowArch, t);
  const mouthOpen = lerp(kfA.mouthOpen, kfB.mouthOpen, t);
  const mouthSmile = lerp(kfA.mouthSmile, kfB.mouthSmile, t);
  const headTiltDeg = lerp(kfA.headTilt, kfB.headTilt, t);

  // Back hair silhouette (behind neck/shoulders)
  ctx.save();
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.ellipse(centerX, headY + 34, 68, 56, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Neck & collarbone with natural skin shading
  ctx.save();
  const neckGrad = ctx.createLinearGradient(centerX - 24, headY + 42, centerX + 24, headY + 105);
  neckGrad.addColorStop(0, '#d99b72');
  neckGrad.addColorStop(0.35, '#f3c19d');
  neckGrad.addColorStop(1, '#e7b18a');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(centerX - 22, headY + 45);
  ctx.lineTo(centerX + 22, headY + 45);
  ctx.lineTo(centerX + 34, height * 0.56);
  ctx.lineTo(centerX - 34, height * 0.56);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Tailored Instructor Jacket / Sweater
  ctx.save();
  const jacketGrad = ctx.createLinearGradient(centerX, height * 0.50, centerX, height);
  jacketGrad.addColorStop(0, '#0f365c');
  jacketGrad.addColorStop(1, '#09223b');
  ctx.fillStyle = jacketGrad;
  ctx.strokeStyle = '#1e4e79';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(centerX - 156, height);
  ctx.quadraticCurveTo(centerX - 144, height * 0.55, centerX - 72, height * 0.51);
  ctx.lineTo(centerX - 28, height * 0.50);
  // V-neck collar opening
  ctx.lineTo(centerX, height * 0.62);
  ctx.lineTo(centerX + 28, height * 0.50);
  ctx.lineTo(centerX + 72, height * 0.51);
  ctx.quadraticCurveTo(centerX + 144, height * 0.55, centerX + 156, height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Soft white inner top at neckline
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(centerX - 26, height * 0.51);
  ctx.quadraticCurveTo(centerX, height * 0.56, centerX + 26, height * 0.51);
  ctx.lineTo(centerX, height * 0.62);
  ctx.closePath();
  ctx.fill();

  // Lapel contour lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 36, height * 0.51);
  ctx.lineTo(centerX, height * 0.66);
  ctx.lineTo(centerX + 36, height * 0.51);
  ctx.stroke();
  ctx.restore();

  // Sculpted Expressive Head & Face
  ctx.save();
  ctx.translate(centerX, headY);
  ctx.rotate((headTiltDeg * Math.PI) / 180);

  // Ears
  ctx.fillStyle = '#e7b18a';
  ctx.beginPath();
  ctx.ellipse(-57, 4, 9, 17, -0.1, 0, Math.PI * 2);
  ctx.ellipse(57, 4, 9, 17, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Sculpted Face Contour (Jawline + Temple)
  const faceGrad = ctx.createRadialGradient(-12, -16, 10, 0, 4, 72);
  faceGrad.addColorStop(0, '#fde2cd');
  faceGrad.addColorStop(0.65, '#f5c6a5');
  faceGrad.addColorStop(1, '#dfa47c');
  ctx.fillStyle = faceGrad;
  ctx.strokeStyle = '#9c6644';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.moveTo(-55, -14);
  ctx.bezierCurveTo(-56, -54, 56, -54, 55, -14);
  ctx.bezierCurveTo(54, 26, 36, 58, 0, 68);
  ctx.bezierCurveTo(-36, 58, -54, 26, -55, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle warm cheek blush
  ctx.fillStyle = 'rgba(244, 114, 182, 0.14)';
  ctx.beginPath();
  ctx.ellipse(-30, 14, 14, 9, 0, 0, Math.PI * 2);
  ctx.ellipse(30, 14, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Layered Hair Crown & Side Sweeps
  const hairGrad = ctx.createLinearGradient(0, -74, 0, 20);
  hairGrad.addColorStop(0, '#27272a');
  hairGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = hairGrad;
  ctx.beginPath();
  ctx.moveTo(-58, -4);
  ctx.bezierCurveTo(-64, -52, -32, -74, 4, -72);
  ctx.bezierCurveTo(40, -72, 64, -48, 58, -4);
  ctx.bezierCurveTo(52, -28, 30, -44, -6, -46);
  ctx.bezierCurveTo(-32, -46, -50, -30, -58, -4);
  ctx.closePath();
  ctx.fill();

  // Almond-Shaped Expressive Eyes with Irises & Catchlights
  [-22, 22].forEach((eyeX) => {
    ctx.save();
    ctx.translate(eyeX, -6);

    // Sclera (white of eye)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.quadraticCurveTo(0, -7.5, 11, 0);
    ctx.quadraticCurveTo(0, 6.5, -11, 0);
    ctx.closePath();
    ctx.fill();

    // Iris
    ctx.fillStyle = '#4f3222';
    ctx.beginPath();
    ctx.arc(0, 0, 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(0, 0, 2.3, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight catchlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(1.6, -1.6, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Upper eyelid & lash line
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-12, 0.5);
    ctx.quadraticCurveTo(0, -8, 12, 0.5);
    ctx.stroke();

    ctx.restore();
  });

  // Sculpted Dynamic Eyebrows (Essential for Sign Language Non-Manual Markers)
  const browOffsetY = -22 - eyebrowArch * 10;
  const browInnerTilt = eyebrowArch * -5;
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';

  // Left eyebrow
  ctx.beginPath();
  ctx.moveTo(-36, browOffsetY + 3);
  ctx.quadraticCurveTo(-22, browOffsetY - 5, -9, browOffsetY + browInnerTilt);
  ctx.stroke();

  // Right eyebrow
  ctx.beginPath();
  ctx.moveTo(36, browOffsetY + 3);
  ctx.quadraticCurveTo(22, browOffsetY - 5, 9, browOffsetY + browInnerTilt);
  ctx.stroke();

  // Anatomical Nose Bridge & Tip
  ctx.strokeStyle = '#b07552';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-2, -6);
  ctx.quadraticCurveTo(-4, 8, -5, 14);
  ctx.quadraticCurveTo(0, 17, 5, 14);
  ctx.stroke();

  // Expressive Lips & Mouth Cavity
  const mouthY = 33;
  const smileCurve = mouthSmile * 11;
  const openHeight = mouthOpen * 16;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-19, mouthY - smileCurve * 0.35);
  ctx.quadraticCurveTo(0, mouthY + smileCurve * 0.65, 19, mouthY - smileCurve * 0.35);
  ctx.quadraticCurveTo(
    0,
    mouthY + smileCurve + Math.max(3, openHeight),
    -19,
    mouthY - smileCurve * 0.35
  );
  ctx.closePath();

  ctx.fillStyle = openHeight > 3 ? '#7f1d1d' : '#c86d6d';
  ctx.fill();

  // Upper teeth hint when smiling or speaking
  if (openHeight > 4.5) {
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(-11, mouthY + smileCurve * 0.25, 22, 4, 1.5);
    ctx.fill();
  }

  ctx.strokeStyle = '#9f3e46';
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // End head transform

  // Interpolated Left & Right Hands
  const leftX = lerp(kfA.leftHand.x, kfB.leftHand.x, t) * width;
  const leftY = lerp(kfA.leftHand.y, kfB.leftHand.y, t) * height;
  const leftRot = lerp(kfA.leftHand.rotation, kfB.leftHand.rotation, t);
  const leftSpread = lerp(kfA.leftHand.fingerSpread, kfB.leftHand.fingerSpread, t);

  const rightX = lerp(kfA.rightHand.x, kfB.rightHand.x, t) * width;
  const rightY = lerp(kfA.rightHand.y, kfB.rightHand.y, t) * height;
  const rightRot = lerp(kfA.rightHand.rotation, kfB.rightHand.rotation, t);
  const rightSpread = lerp(kfA.rightHand.fingerSpread, kfB.rightHand.fingerSpread, t);

  // Sculpted Sleeves & Forearms connecting shoulders to wrists
  drawInstructorArm(ctx, centerX - 102, height * 0.57, centerX - 125, height * 0.78, leftX, leftY);
  drawInstructorArm(ctx, centerX + 102, height * 0.57, centerX + 125, height * 0.74, rightX, rightY);

  // Trajectory Vector Arrow
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

  // Draw sculpted articulated hands
  drawArticulatedHand(ctx, leftX, leftY, leftRot, leftSpread, false);
  drawArticulatedHand(ctx, rightX, rightY, rightRot, rightSpread, true);

  ctx.restore();

  if (options.showVectors) {
    const displayRightX = options.mirrorMode ? width - rightX : rightX;
    const displayLeftX = options.mirrorMode ? width - leftX : leftX;

    drawHandBadge(ctx, displayRightX, rightY + 50, kfA.rightHand.shapeLabel, '#0284c7');
    drawHandBadge(ctx, displayLeftX, leftY + 50, kfA.leftHand.shapeLabel, '#475569');
  }
}

function drawInstructorArm(
  ctx: CanvasRenderingContext2D,
  shoulderX: number,
  shoulderY: number,
  elbowX: number,
  elbowY: number,
  wristX: number,
  wristY: number
) {
  ctx.save();
  ctx.strokeStyle = '#123e6b';
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.quadraticCurveTo(elbowX, elbowY, wristX, wristY + 8);
  ctx.stroke();

  // Cuff highlight at wrist
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(wristX, wristY + 6, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
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

  if (isDominant) {
    const halo = ctx.createRadialGradient(0, -10, 4, 0, -10, 44);
    halo.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, -10, 44, 0, Math.PI * 2);
    ctx.fill();
  }

  const handGrad = ctx.createLinearGradient(-18, -36, 18, 22);
  handGrad.addColorStop(0, '#fde2cd');
  handGrad.addColorStop(0.6, '#f4c39e');
  handGrad.addColorStop(1, '#dc9e76');

  ctx.fillStyle = handGrad;
  ctx.strokeStyle = isDominant ? '#0284c7' : '#7c4d32';
  ctx.lineWidth = 1.8;

  // Sculpted Palm with natural wrist & thenar curve
  ctx.beginPath();
  ctx.moveTo(-14, 16);
  ctx.bezierCurveTo(-21, 6, -20, -12, -16, -15);
  ctx.lineTo(16, -15);
  ctx.bezierCurveTo(20, -12, 20, 6, 14, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Palm lifeline detail
  ctx.strokeStyle = 'rgba(156, 102, 68, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-10, -4);
  ctx.quadraticCurveTo(2, -2, 11, -7);
  ctx.moveTo(-6, 8);
  ctx.quadraticCurveTo(-2, -1, 6, -2);
  ctx.stroke();

  // 4 Articulated Tapered Fingers (Index, Middle, Ring, Pinky)
  const fingerBaseX = [-12, -4, 4, 12];
  const fingerMaxLen = [26, 30, 27, 21];
  const spreadAngle = fingerSpread * 0.16;

  for (let i = 0; i < 4; i++) {
    const offsetIdx = i - 1.5;
    const len = 9 + fingerSpread * fingerMaxLen[i];
    ctx.save();
    ctx.translate(fingerBaseX[i], -13);
    ctx.rotate(offsetIdx * spreadAngle);

    ctx.fillStyle = handGrad;
    ctx.strokeStyle = isDominant ? '#0284c7' : '#7c4d32';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.roundRect(-3.6, -len, 7.2, len, 3.6);
    ctx.fill();
    ctx.stroke();

    // Fingernail tip when extended
    if (fingerSpread > 0.35) {
      ctx.fillStyle = 'rgba(255, 247, 240, 0.75)';
      ctx.beginPath();
      ctx.roundRect(-2.2, -len + 1.5, 4.4, 4.2, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Sculpted Thumb with Thenar Base
  ctx.save();
  const thumbAngle = -0.42 - fingerSpread * 0.48;
  ctx.translate(-15, 0);
  ctx.rotate(thumbAngle);
  ctx.fillStyle = handGrad;
  ctx.strokeStyle = isDominant ? '#0284c7' : '#7c4d32';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-4, -20, 8, 20, 4);
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
