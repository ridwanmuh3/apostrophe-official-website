<script setup lang="ts">
import { eases } from "~/assets/data/motion";

const { gsap } = useGsap();

const sectionRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const scrollCueRef = ref<HTMLElement | null>(null);

const whatsapp =
  "https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih";

const meta = ["EST. 2023", "TASIKMALAYA", "POP · ROCK · ALT"];
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (!sectionRef.value || !imageRef.value) return;

    const intro = gsap.timeline({ defaults: { ease: eases.expo } });

    intro.from(
      ".hero-reveal",
      { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 },
      0.15,
    );

    gsap.to(imageRef.value, {
      yPercent: 7,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (titleRef.value) {
      gsap.to(titleRef.value, {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    if (scrollCueRef.value) {
      gsap.fromTo(
        scrollCueRef.value.querySelector(".scroll-line"),
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.5,
          repeat: -1,
          repeatDelay: 0.25,
          ease: "power2.inOut",
          delay: 2,
        },
      );
    }
  });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
  <section
    id="home-section"
    ref="sectionRef"
    class="relative isolate flex min-h-[100svh] w-full flex-col justify-end overflow-hidden pt-28"
  >
    <!-- Full-bleed live shot -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <img
        ref="imageRef"
        src="/images/hero-1600.webp"
        srcset="
          /images/hero-800.webp 800w,
          /images/hero-1200.webp 1200w,
          /images/hero-1600.webp 1600w,
          /images/hero-2400.webp 2400w
        "
        sizes="100vw"
        width="2400"
        height="1600"
        alt="Apostrophe tampil di atas panggung"
        fetchpriority="high"
        decoding="async"
        class="grade-warm h-full w-full object-cover object-[50%_36%] will-change-transform"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
      <div class="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/30" />
    </div>

    <!-- Right-edge meta -->
    <div
      class="hero-reveal absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-8 lg:flex"
      aria-hidden="true"
    >
      <span class="h-16 w-px bg-bone/20" />
      <div class="writing-vertical flex items-center gap-6 font-oxanium text-[9px] uppercase tracking-[0.32em] text-bone/70">
        <span v-for="item in meta" :key="item">{{ item }}</span>
      </div>
      <span class="h-16 w-px bg-bone/20" />
    </div>

    <div
      class="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-10 md:px-10 md:pb-14"
    >
      <div ref="titleRef">
        <p class="hero-reveal font-oxanium text-[9px] uppercase tracking-[0.34em] text-champagne/80">
          Official site
        </p>

        <h1 class="mt-6 font-display leading-[0.82] tracking-[-0.025em]">
          <span class="block overflow-hidden">
            <span class="hero-line-inner block pb-[0.06em] text-[clamp(1.9rem,4.2vw,3.2rem)] italic text-bone/80">
              We are
            </span>
          </span>
          <span class="block overflow-hidden">
            <span class="hero-line-inner block pb-[0.08em] text-[clamp(4.1rem,13vw,11.5rem)] text-bone">
              Apostrophe
            </span>
          </span>
        </h1>
      </div>

      <div class="mt-9 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-sm">
          <p class="hero-reveal text-[15px] leading-relaxed text-bone/70">
            Band musik Pop, Rock &amp; Alternative Rock dari Tasikmalaya.
          </p>
          <div class="hero-reveal mt-7">
            <UiAppButton
              :href="whatsapp"
              target="_blank"
              rel="external noreferrer"
              cursor="Chat"
            >
              <Icon name="ic:baseline-whatsapp" class="text-base" />
              Hubungi Kami
            </UiAppButton>
          </div>
        </div>

        <div ref="scrollCueRef" class="hero-reveal hidden items-center gap-4 sm:flex">
          <span class="font-oxanium text-[9px] uppercase tracking-[0.3em] text-ash">
            Scroll
          </span>
          <span class="relative block h-14 w-px overflow-hidden bg-bone/15">
            <span class="scroll-line absolute inset-0 block bg-champagne" />
          </span>
        </div>
      </div>
    </div>

    <!-- Genre marquee -->
    <div class="hero-reveal relative z-10 border-y border-bone/10 py-3">
      <UiMarquee
        :items="['POP', 'ROCK', 'ALTERNATIVE', 'TASIKMALAYA', 'EST. 2023']"
        :speed="34"
      />
    </div>
  </section>
</template>
