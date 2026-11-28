<script setup lang="ts">
const props = defineProps<{ analyser: AnalyserNode | null; playing: boolean; reduced: boolean }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let frame = 0;
let observer: ResizeObserver | null = null;
let values: Uint8Array<ArrayBuffer> | null = null;
const intensity = defineModel<number>("intensity", { default: 0 });

function draw() {
  if (!canvas.value || document.hidden) return;
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas.value;
  ctx.clearRect(0, 0, width, height);
  if (props.analyser && props.playing && !props.reduced) {
    if (!values || values.length !== props.analyser.frequencyBinCount) values = new Uint8Array(props.analyser.frequencyBinCount);
    props.analyser.getByteFrequencyData(values);
  }
  const count = 48;
  const gap = width / count;
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const level = props.playing && !props.reduced
      ? props.analyser && values
        ? values[Math.floor(i * values.length / (count * 1.8))]! / 255
        : (Math.sin(performance.now() / 270 + i * 0.6) + 1) * 0.18
      : 0;
    sum += level;
    const barHeight = Math.max(3, (0.08 + level * 0.83) * height);
    ctx.fillStyle =
      i / count < 0.65 ? "rgba(198, 176, 140, 0.92)" : "rgba(139, 92, 246, 0.5)";
    ctx.fillRect(i * gap, (height - barHeight) / 2, Math.max(1, gap * 0.48), barHeight);
  }
  if (props.playing) intensity.value = sum / count;
  else intensity.value = 0;
  if (props.playing && !props.reduced) frame = requestAnimationFrame(draw);
}

function redraw() {
  if (!canvas.value) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.value.width = canvas.value.clientWidth * ratio;
  canvas.value.height = canvas.value.clientHeight * ratio;
  cancelAnimationFrame(frame);
  draw();
}

function onVisibility() { if (!document.hidden) redraw(); else cancelAnimationFrame(frame); }
onMounted(() => {
  observer = new ResizeObserver(redraw);
  if (canvas.value) observer.observe(canvas.value);
  document.addEventListener("visibilitychange", onVisibility);
  redraw();
});
watch(() => [props.playing, props.reduced, props.analyser], redraw);
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<template>
  <canvas ref="canvas" class="h-16 w-full md:h-20" aria-hidden="true" />
</template>
