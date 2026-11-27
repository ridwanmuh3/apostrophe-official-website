<script setup lang="ts">
withDefaults(
  defineProps<{
    currentTime: number;
    duration: number;
    playing: boolean;
    visible: boolean;
  }>(),
  {},
);
const emit = defineEmits<{ toggle: []; seek: [time: number] }>();
const { gsap } = useGsap();

function enter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", onComplete: done },
  );
}

function leave(el: Element, done: () => void) {
  gsap.to(el, {
    y: 30,
    opacity: 0,
    duration: 0.25,
    ease: "power2.in",
    onComplete: done,
  });
}
</script>

<template>
  <Transition :css="false" @enter="enter" @leave="leave">
    <aside
      v-if="visible"
      class="fixed bottom-4 left-4 right-4 z-40 flex max-w-sm items-center gap-3 rounded-editorial border border-champagne/20 bg-ink/95 p-3 shadow-[8px_16px_48px_rgba(0,0,0,.6)] sm:bottom-6 sm:left-6 sm:w-80"
      aria-label="Pemutar Back to Me"
    >
      <img
        src="/logo/apostrophe.webp"
        alt=""
        width="44"
        height="44"
        class="h-11 w-11 shrink-0 rounded-editorial object-cover ring-1 ring-bone/10"
      >
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-normal text-bone">Back to Me</p>
        <p class="font-oxanium text-[9px] uppercase tracking-[0.22em] text-ash">
          Apostrophe
        </p>
        <input
          type="range"
          class="mt-2 block h-3 w-full cursor-pointer accent-champagne focus-visible:outline-1 focus-visible:outline-champagne"
          min="0"
          :max="duration || 177"
          :value="currentTime"
          step="1"
          aria-label="Geser posisi lagu Back to Me"
          @input="emit('seek', Number(($event.target as HTMLInputElement).value))"
        >
      </div>
      <button
        type="button"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-editorial border border-champagne/40 text-bone transition-colors hover:bg-bone hover:text-ink focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-champagne"
        :aria-label="playing ? 'Jeda Back to Me' : 'Putar Back to Me'"
        :aria-pressed="playing"
        @click="emit('toggle')"
      >
        <Icon :name="playing ? 'mdi:pause' : 'mdi:play'" class="text-xl" />
      </button>
    </aside>
  </Transition>
</template>
