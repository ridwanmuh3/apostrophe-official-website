<script setup lang="ts">
const { gsap } = useGsap();

const enabled = ref(false);
const visible = ref(false);
const interactive = ref(false);
const label = ref("");
const dot = ref<HTMLElement | null>(null);

let xTo: ((value: number) => void) | null = null;
let yTo: ((value: number) => void) | null = null;
let removeListeners: (() => void) | null = null;

onMounted(() => {
  const fine = window.matchMedia("(pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduced.matches) return;

  enabled.value = true;

  nextTick(() => {
    if (!dot.value) return;

    gsap.set(dot.value, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    xTo = gsap.quickTo(dot.value, "x", { duration: 0.18, ease: "power3" });
    yTo = gsap.quickTo(dot.value, "y", { duration: 0.18, ease: "power3" });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      document.documentElement.classList.add("has-custom-cursor");
      visible.value = true;
      xTo?.(event.clientX);
      yTo?.(event.clientY);

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, input, label, [role='button']",
      );

      interactive.value = !!target;
      label.value = target?.dataset.cursor ?? "";
    };

    const onLeave = () => {
      visible.value = false;
      document.documentElement.classList.remove("has-custom-cursor");
    };

    // Keyboard users always keep the native cursor.
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      visible.value = false;
      document.documentElement.classList.remove("has-custom-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("keydown", onKeydown);

    removeListeners = () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKeydown);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  });
});

onBeforeUnmount(() => {
  removeListeners?.();
  removeListeners = null;
});
</script>

<template>
  <div
    v-if="enabled"
    aria-hidden="true"
    class="pointer-events-none fixed left-0 top-0 z-[120] hidden lg:block"
    :class="visible ? 'opacity-100' : 'opacity-0'"
  >
    <div
      ref="dot"
      class="flex items-center gap-3 transition-opacity duration-300"
    >
      <span
        class="block h-1.5 w-1.5 rounded-full bg-champagne transition-transform duration-300 ease-editorial"
        :class="interactive ? 'scale-[2.4] opacity-60' : 'scale-100'"
      />
      <span
        v-if="label"
        class="whitespace-nowrap font-oxanium text-[9px] uppercase tracking-[0.3em] text-champagne"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>
