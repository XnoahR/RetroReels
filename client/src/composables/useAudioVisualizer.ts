import { ref, onBeforeUnmount } from 'vue';

export function useAudioVisualizer() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const isReady = ref(false);

  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let source: MediaElementSourceNode | null = null;
  let animationId: number | null = null;
  let dataArray: Uint8Array | null = null;

  const init = (audioElement: HTMLAudioElement) => {
    if (!canvasRef.value || isReady.value) return;

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      isReady.value = true;
      draw();
    } catch {
      isReady.value = false;
    }
  };

  const draw = () => {
    if (!canvasRef.value || !analyser || !dataArray) return;

    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const barCount = 64;
    const step = Math.floor(dataArray.length / barCount);
    const barWidth = width / barCount;
    const gap = 2;

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step];
      const barHeight = (value / 255) * height * 0.8;

      const hue = 20 + (i / barCount) * 20;
      const saturation = 80 + (value / 255) * 20;
      const lightness = 40 + (value / 255) * 25;
      const alpha = 0.3 + (value / 255) * 0.5;

      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

      const x = i * barWidth + gap / 2;
      const y = height - barHeight;
      const w = barWidth - gap;

      ctx.beginPath();
      ctx.roundRect(x, y, w, barHeight, 2);
      ctx.fill();

      if (value > 100) {
        ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.4)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    animationId = requestAnimationFrame(draw);
  };

  const cleanup = () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (source) source.disconnect();
    if (analyser) analyser.disconnect();
    if (audioContext && audioContext.state !== 'closed') audioContext.close();
    isReady.value = false;
  };

  onBeforeUnmount(cleanup);

  return { canvasRef, isReady, init, cleanup };
}
