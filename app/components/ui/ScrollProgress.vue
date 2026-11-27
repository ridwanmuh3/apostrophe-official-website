<script setup lang="ts">
const { gsap, ScrollTrigger } = useGsap();
const bar = ref<HTMLElement | null>(null);
let trigger: ReturnType<typeof ScrollTrigger.create> | null = null;

onMounted(() => {
  if (!bar.value) return;

  gsap.set(bar.value, { scaleX: 0 });

  trigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      gsap.set(bar.value, { scaleX: self.progress });
    },
  });
});

onBeforeUnmount(() => trigger?.kill());
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-bone/5"
  >
    <div ref="bar" class="h-full w-full origin-left bg-champagne/70" />
  </div>
</template>
