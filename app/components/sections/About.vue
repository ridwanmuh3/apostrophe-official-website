<script setup lang="ts">
import type { SplitText as SplitTextType } from "gsap/SplitText";

const { gsap, SplitText } = useGsap();

const root = ref<HTMLElement | null>(null);
const statement = ref<HTMLElement | null>(null);
const copy = ref<HTMLElement | null>(null);
const watermark = ref<HTMLElement | null>(null);

let split: SplitTextType | null = null;
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(async () => {
  await document.fonts?.ready.catch(() => {});

  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (statement.value) {
      split = SplitText.create(statement.value, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });

      gsap.from(split.lines, {
        yPercent: 112,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: statement.value,
          start: "top 82%",
          once: true,
        },
      });
    }

    if (copy.value) {
      gsap.from(copy.value, {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: copy.value,
          start: "top 88%",
          once: true,
        },
      });
    }

    if (watermark.value) {
      gsap.to(watermark.value, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: root.value,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    return () => {
      split?.revert();
      split = null;
    };
  });
});

onBeforeUnmount(() => {
  mm?.revert();
});
</script>

<template>
  <section
    id="about-section"
    ref="root"
    class="relative isolate overflow-hidden bg-bone py-32 text-ink md:py-44"
  >
    <span
      ref="watermark"
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-[12%] right-[3%] select-none font-display text-[34vw] leading-none text-ink/[0.06] md:-bottom-[16%] md:right-[5%] md:text-[26vw]"
    >
      '
    </span>

    <div class="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
      <UiSectionLabel index="03" label="Tentang Kami" tone="dark" />

      <div class="mt-16 grid grid-cols-12 gap-y-14 md:mt-24 md:gap-x-10">
        <div class="col-span-12 md:col-span-7">
          <h2
            ref="statement"
            class="font-display text-[clamp(2.7rem,6.2vw,5.6rem)] leading-[0.95] tracking-[-0.025em]"
          >
            Mari Berkenalan<br>
            <em class="italic">dengan Kami</em>
          </h2>
        </div>

        <div class="col-span-12 md:col-span-4 md:col-start-9 md:pt-4">
          <div class="h-px w-full bg-ink/15" />
          <div ref="copy" class="mt-8">
            <p class="text-[15px] leading-[1.85] text-ink/70">
              <span class="text-ink">Apostrophe</span> merupakan band yang
              terbentuk sejak 2023 di Kota Tasikmalaya. Pada dasarnya band ini
              merupakan band sekumpulan mahasiswa yang memiliki hobi yang sama
              dibidang musik. Terinspirasi dari konsep bahasa pemrograman yang
              sering menggunakan
              <span class="text-ink">"Tanda Petik ( ' )"</span> untuk
              mendefinisikan karakter atau string. Sehingga kami memberi nama
              band "Apostrophe".
            </p>

            <div class="mt-10 flex items-center gap-4">
              <span class="h-px flex-1 bg-ink/15" />
              <span class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ink/45">
                EST. 2023
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
