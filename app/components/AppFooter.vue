<script setup lang="ts">
const { gsap } = useGsap();

const root = ref<HTMLElement | null>(null);
const wordmark = ref<HTMLElement | null>(null);
const meta = ref<HTMLElement | null>(null);

const year = new Date().getFullYear();
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (!root.value || !wordmark.value) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root.value,
        start: "top 92%",
        once: true,
      },
    });

    timeline.from(wordmark.value, {
      yPercent: 22,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
    });

    if (meta.value) {
      timeline.from(
        Array.from(meta.value.children),
        { y: 18, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.7",
      );
    }
  });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
  <footer ref="root" class="relative w-full overflow-hidden bg-ink pt-16 md:pt-24">
    <div class="mx-auto w-full max-w-7xl px-6 md:px-10">
      <div
        ref="meta"
        class="flex flex-col gap-8 border-t border-bone/10 pt-8 md:flex-row md:items-start md:justify-between"
      >
        <div>
          <p class="font-oxanium text-[10px] uppercase tracking-[0.3em] text-ash">
            Tasikmalaya · Indonesia
          </p>
          <p class="mt-3 max-w-xs text-sm leading-relaxed text-ash">
            Pop, rock, dan alternative rock sejak 2023.
          </p>
        </div>
        <SocialMediaLinks />
      </div>

      <div class="mt-14 md:mt-20">
        <p
          ref="wordmark"
          aria-hidden="true"
          class="footer-wordmark whitespace-nowrap font-display text-[clamp(3.4rem,15.5vw,15rem)] leading-[0.82] tracking-[-0.035em] text-bone/90"
        >
          Apostrophe
        </p>
      </div>

      <div
        class="mt-10 flex flex-col gap-3 border-t border-bone/10 py-6 font-oxanium text-[10px] uppercase tracking-[0.22em] text-ash sm:flex-row sm:items-center sm:justify-between"
      >
        <p>&copy; {{ year }} Apostrophe</p>
        <p>Crafted by Apostrophe</p>
        <p>EST. 2023</p>
      </div>
    </div>
  </footer>
</template>
