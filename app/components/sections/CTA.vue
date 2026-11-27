<script setup lang="ts">
const { gsap } = useGsap();

const root = ref<HTMLElement | null>(null);

const whatsapp =
  "https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih";
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (!root.value) return;

    gsap.from(root.value.querySelectorAll(".cta-reveal"), {
      y: 28,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: root.value,
        start: "top 78%",
        once: true,
      },
    });
  });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
  <section
    id="cta-section"
    ref="root"
    class="relative w-full overflow-hidden border-t border-bone/10 py-32 md:py-44"
  >
    <div class="mx-auto max-w-7xl px-6 md:px-10">
      <div class="cta-reveal">
        <UiSectionLabel index="06" label="Kontak" />
      </div>

      <div class="mt-12 grid grid-cols-12 items-end gap-y-12 md:mt-16 md:gap-x-10">
        <h2
          class="cta-reveal col-span-12 font-display text-[clamp(3.4rem,9.5vw,8.5rem)] leading-[0.84] tracking-[-0.03em] md:col-span-8"
        >
          Hubungi <em class="italic">Kami</em>
        </h2>

        <div class="cta-reveal col-span-12 md:col-span-4">
          <p class="max-w-sm text-[15px] leading-[1.8] text-ash">
            Ingin mengetahui kami lebih jauh atau tertarik untuk mendatangkan
            kami di acara anda? Hubungi kami sekarang!
          </p>

          <div class="mt-8">
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
      </div>
    </div>

    <div class="mt-24 border-y border-bone/10 py-5 md:mt-32">
      <UiMarquee
        :items="['APOSTROPHE', 'POP', 'ROCK', 'ALTERNATIVE']"
        :speed="52"
        separator="·"
      />
    </div>
  </section>
</template>
