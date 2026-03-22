<script setup lang="ts">
const { gsap } = useGsap();
const footerRef = ref<HTMLElement | null>(null);
const innerRef = ref<HTMLElement | null>(null);
const year = new Date().getFullYear();

onMounted(() => {
  if (!innerRef.value) return;

  gsap.fromTo(
    innerRef.value.children,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerRef.value,
        start: "top 92%",
      },
    },
  );
});
</script>

<template>
  <footer
    ref="footerRef"
    class="border-t border-zinc-800/60 py-16 px-6 md:px-10"
  >
    <div ref="innerRef" class="max-w-7xl mx-auto flex flex-col gap-6 items-center">
      <SocialMediaLinks />
      <p class="text-sm text-zinc-500">&copy; {{ year }}, Crafted by Apostrophe</p>
    </div>
  </footer>
</template>
