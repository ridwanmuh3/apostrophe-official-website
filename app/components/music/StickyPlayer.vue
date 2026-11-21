<script setup lang="ts">
defineProps<{ currentTime: number; duration: number; playing: boolean; visible: boolean }>();
const emit = defineEmits<{ toggle: []; seek: [time: number] }>();
const { gsap } = useGsap();
function enter(el: Element, done: () => void) {
  gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out", onComplete: done });
}
function leave(el: Element, done: () => void) {
  gsap.to(el, { y: 60, opacity: 0, duration: 0.25, onComplete: done });
}
</script>

<template>
  <Transition :css="false" @enter="enter" @leave="leave">
    <aside v-if="visible" class="fixed bottom-4 left-4 right-4 z-40 flex max-w-sm items-center gap-3 bg-zinc-900 p-3 shadow-[8px_16px_48px_rgba(0,0,0,.6)] sm:right-auto sm:bottom-6 sm:left-6 sm:w-80" aria-label="Pemutar Back to Me">
      <img src="/logo/apostrophe.webp" alt="" class="h-11 w-11 shrink-0 rounded-sm" >
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-white">Back to Me</p>
        <p class="text-xs text-zinc-300">Apostrophe</p>
        <input type="range" class="mt-2 block h-3 w-full cursor-pointer accent-violet-300 focus-visible:outline-2 focus-visible:outline-violet-300" min="0" :max="duration || 177" :value="currentTime" step="1" aria-label="Geser posisi lagu Back to Me" @input="emit('seek', Number(($event.target as HTMLInputElement).value))" >
      </div>
      <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300" :aria-label="playing ? 'Jeda Back to Me' : 'Putar Back to Me'" :aria-pressed="playing" @click="emit('toggle')">
        <Icon :name="playing ? 'mdi:pause' : 'mdi:play'" class="text-xl" />
      </button>
    </aside>
  </Transition>
</template>
