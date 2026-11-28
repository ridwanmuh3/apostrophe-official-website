<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: string[];
    /** Seconds for a full loop. */
    speed?: number;
    separator?: string;
    pauseOnHover?: boolean;
  }>(),
  { speed: 40, separator: "·", pauseOnHover: false },
);

const { gsap } = useGsap();
const root = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  if (!track.value) return;

  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const tween = gsap.to(track.value, {
      xPercent: -50,
      duration: props.speed,
      ease: "none",
      repeat: -1,
    });

    let enter: (() => void) | null = null;
    let leave: (() => void) | null = null;

    if (props.pauseOnHover && root.value) {
      enter = () => gsap.to(tween, { timeScale: 0, duration: 0.4 });
      leave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      root.value.addEventListener("pointerenter", enter);
      root.value.addEventListener("pointerleave", leave);
    }

    return () => {
      tween.kill();
      if (root.value && enter && leave) {
        root.value.removeEventListener("pointerenter", enter);
        root.value.removeEventListener("pointerleave", leave);
      }
    };
  });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
  <div ref="root" class="relative w-full overflow-hidden">
    <div ref="track" class="flex w-max will-change-transform">
      <div
        v-for="copy in 2"
        :key="copy"
        class="flex shrink-0 items-center"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <span
          v-for="(item, idx) in items"
          :key="`${copy}-${idx}`"
          class="flex shrink-0 items-center gap-6 pr-6 font-oxanium text-[11px] uppercase tracking-[0.34em] text-bone/70 md:gap-8 md:pr-8"
        >
          {{ item }}
          <span class="text-champagne/60" aria-hidden="true">{{ separator }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
