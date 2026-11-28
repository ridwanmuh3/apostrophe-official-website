<script setup lang="ts">
const props = defineProps<{
  currentTime: number;
  duration: number;
  disabled?: boolean;
}>();
const emit = defineEmits<{ seek: [time: number]; toggle: [] }>();

const dragging = ref(false);
const preview = ref(0);
const time = computed(() => (dragging.value ? preview.value : props.currentTime));
const percent = computed(
  () => `${Math.min(100, (time.value / (props.duration || 1)) * 100)}%`,
);

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const seconds = Math.floor(value);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function onInput(event: Event) {
  preview.value = Number((event.target as HTMLInputElement).value);
  emit("seek", preview.value);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const next = Math.max(
    0,
    Math.min(
      props.duration,
      props.currentTime + (event.key === "ArrowRight" ? 5 : -5),
    ),
  );
  emit("seek", next);
}
</script>

<template>
  <div class="w-full">
    <input
      type="range"
      class="seek-input block w-full cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-champagne"
      min="0"
      :max="duration || 177"
      step="1"
      :value="time"
      :disabled="disabled"
      :style="{ '--progress': percent }"
      aria-label="Geser posisi lagu Back to Me"
      :aria-valuetext="`${formatTime(time)} dari ${formatTime(duration)}`"
      @pointerdown="dragging = true; preview = currentTime"
      @pointerup="dragging = false"
      @pointercancel="dragging = false"
      @blur="dragging = false"
      @input="onInput"
      @keydown.space.prevent="emit('toggle')"
      @keydown="onKeydown"
    >
    <div
      class="mt-2 flex justify-between font-oxanium text-[9px] tabular-nums tracking-[0.18em] text-ash"
      aria-hidden="true"
    >
      <span>{{ formatTime(time) }}</span>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<style scoped>
.seek-input {
  appearance: none;
  height: 18px;
  background: transparent;
}
.seek-input::-webkit-slider-runnable-track {
  height: 2px;
  background: linear-gradient(
    to right,
    #c6b08c var(--progress),
    rgba(243, 238, 229, 0.16) var(--progress)
  );
}
.seek-input::-moz-range-track {
  height: 2px;
  background: linear-gradient(
    to right,
    #c6b08c var(--progress),
    rgba(243, 238, 229, 0.16) var(--progress)
  );
}
.seek-input::-webkit-slider-thumb {
  appearance: none;
  width: 11px;
  height: 11px;
  border-radius: 2px;
  background: #f3eee5;
  margin-top: -4.5px;
  box-shadow: 0 0 0 1px rgba(10, 10, 11, 0.6);
}
.seek-input::-moz-range-thumb {
  width: 11px;
  height: 11px;
  border: 0;
  border-radius: 2px;
  background: #f3eee5;
  box-shadow: 0 0 0 1px rgba(10, 10, 11, 0.6);
}
</style>
