<script setup lang="ts">
const { gsap } = useGsap();
const sectionRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);
const ctaRef = ref<HTMLElement | null>(null);
const socialRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from(".hero-bg", {
    scale: 1.15,
    opacity: 0,
    duration: 1.8,
    ease: "power2.out",
  });

  tl.from(
    ".hero-mesh",
    { opacity: 0, duration: 1.5, ease: "power1.out" },
    "-=1.2",
  );

  tl.from(
    ".hero-text-line",
    { y: "100%", duration: 1.2, stagger: 0.15, ease: "power4.out" },
    "-=1",
  );

  tl.fromTo(
    subtitleRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
    "-=0.5",
  );

  tl.fromTo(
    ctaRef.value,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
    "-=0.3",
  );

  tl.fromTo(
    socialRef.value,
    { y: 15, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
    "-=0.3",
  );

  tl.fromTo(
    scrollRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.5 },
    "-=0.2",
  );

  gsap.to(".scroll-indicator-icon", {
    y: 8,
    repeat: -1,
    yoyo: true,
    duration: 1.2,
    ease: "power1.inOut",
    delay: 3,
  });
});
</script>

<template>
  <section
    id="home-section"
    ref="sectionRef"
    class="relative w-full min-h-screen overflow-hidden"
  >
    <!-- Background image -->
    <div
      class="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: 'url(/images/hero.webp)' }"
    />

    <!-- Gradient overlays -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-zinc-950/60 to-transparent"
    />

    <!-- Mesh gradient accents (inside overflow-hidden, safe) -->
    <div
      class="hero-mesh absolute bottom-0 left-0 w-[500px] h-[400px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none"
    />
    <div
      class="hero-mesh absolute top-0 right-0 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"
    />

    <!-- Content -->
    <div
      class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 min-h-screen flex flex-col justify-end pb-28 md:pb-36 pt-32"
    >
      <div class="flex flex-col gap-4 md:gap-5">
        <!-- Main heading -->
        <div>
          <div class="overflow-hidden">
            <h1
              class="hero-text-line text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-bold leading-[0.9] tracking-tight text-white"
            >
              We are
            </h1>
          </div>
          <div class="overflow-hidden">
            <h1
              class="hero-text-line text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] font-bold leading-[0.9] tracking-tight text-white"
            >
              Apostrophe
            </h1>
          </div>
        </div>

        <!-- Subtitle -->
        <p
          ref="subtitleRef"
          class="text-base md:text-lg text-zinc-400 max-w-md leading-relaxed opacity-0"
        >
          Band Musik Pop, Rock &amp; Alternative Rock dari Tasikmalaya.
        </p>

        <!-- CTA Button -->
        <div ref="ctaRef" class="mt-2 opacity-0">
          <NuxtLink
            class="inline-flex items-center gap-3 bg-white text-zinc-950 px-7 py-3 text-sm font-medium tracking-wide hover:bg-zinc-200 active:scale-[0.98] transition-[background-color,transform] duration-300 cursor-pointer rounded-md"
            to="https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih"
            target="_blank"
            rel="external noreferrer"
          >
            <Icon class="text-lg" name="ic:baseline-whatsapp" />
            <span>Hubungi Kami</span>
          </NuxtLink>
        </div>

        <!-- Social Links -->
        <div ref="socialRef" class="opacity-0">
          <SocialMediaLinks />
        </div>
      </div>
    </div>

    <!-- Scroll indicator (centered to viewport) -->
    <div
      ref="scrollRef"
      class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0"
    >
      <span class="text-[10px] text-zinc-500 tracking-[0.2em] uppercase"
        >Scroll</span
      >
      <Icon
        class="scroll-indicator-icon text-base text-zinc-500"
        name="mdi:chevron-down"
      />
    </div>
  </section>
</template>
