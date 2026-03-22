<script setup lang="ts">
const { gsap, ScrollTrigger } = useGsap();
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!contentRef.value) return;

  const children = Array.from(contentRef.value.children);

  gsap.set(children, { y: 25, opacity: 0 });

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(children, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      });
    },
  });
});
</script>

<template>
  <section
    id="cta-section"
    ref="sectionRef"
    class="relative w-full bg-zinc-900/30 overflow-hidden"
  >
    <!-- Mesh gradient accents -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/8 rounded-full blur-[160px] pointer-events-none"
    />
    <div
      class="absolute bottom-10 left-10 w-[250px] h-[250px] bg-pink-500/6 rounded-full blur-[120px] pointer-events-none"
    />

    <div
      ref="contentRef"
      class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-44 flex flex-col items-center text-center"
    >
      <h2
        class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-tight tracking-tight text-white max-w-3xl"
      >
        Hubungi Kami
      </h2>

      <p
        class="mt-6 text-base md:text-lg text-zinc-400 max-w-xl leading-relaxed"
      >
        Ingin mengetahui kami lebih jauh atau tertarik untuk mendatangkan kami di
        acara anda? Hubungi kami sekarang!
      </p>

      <NuxtLink
        class="mt-10 inline-flex items-center gap-3 bg-white text-zinc-950 px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-colors duration-300 cursor-pointer rounded-md"
        to="https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih"
        target="_blank"
        rel="external noreferrer"
      >
        <Icon class="text-lg" name="ic:baseline-whatsapp" />
        <span>Hubungi Kami</span>
      </NuxtLink>
    </div>
  </section>
</template>
