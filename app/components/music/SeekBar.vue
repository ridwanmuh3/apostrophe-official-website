<script setup lang="ts">
const props = defineProps<{ currentTime: number; duration: number; disabled?: boolean }>();
const emit = defineEmits<{ seek: [time: number]; toggle: [] }>();
const dragging = ref(false);
const preview = ref(0);
const time = computed(() => dragging.value ? preview.value : props.currentTime);
const percent = computed(() => `${Math.min(100, (time.value / (props.duration || 1)) * 100)}%`);

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
  const next = Math.max(0, Math.min(props.duration, props.currentTime + (event.key === "ArrowRight" ? 5 : -5)));
  emit("seek", next);
}
</script>

<template>
  <div class="w-full">
    <input
      type="range"
      class="seek-input block w-full cursor-pointer accent-violet-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
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
    <div class="mt-2 flex justify-between text-xs tabular-nums text-zinc-300" aria-hidden="true">
      <span>{{ formatTime(time) }}</span><span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<style scoped>
.seek-input { appearance: none; height: 18px; background: transparent; }
.seek-input::-webkit-slider-runnable-track { height: 3px; background: linear-gradient(to right, #c4b5fd var(--progress), #52525b var(--progress)); }
.seek-input::-moz-range-track { height: 3px; background: linear-gradient(to right, #c4b5fd var(--progress), #52525b var(--progress)); }
.seek-input::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #f5f3ff; margin-top: -5.5px; box-shadow: 0 0 0 3px #9f7aea55; }
.seek-input::-moz-range-thumb { width: 14px; height: 14px; border: 0; border-radius: 50%; background: #f5f3ff; box-shadow: 0 0 0 3px #9f7aea55; }
</style>
