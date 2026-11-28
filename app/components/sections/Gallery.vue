<script setup lang="ts">
import imagesGallery from "~/assets/data/imagesGallery";

const { gsap } = useGsap();

const stageRef = ref<HTMLElement | null>(null);
const rowARef = ref<HTMLElement | null>(null);
const rowBRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

const pinned = ref(false);
const viewerOpen = ref(false);
const viewerStartIndex = ref(0);
const sourceEl = shallowRef<HTMLElement | null>(null);

const rowOne = imagesGallery.slice(0, 12);
const rowTwo = imagesGallery.slice(12, 24);

// Varied editorial widths, expressed in viewport units and clamped.
const widthsA = [22, 15, 20, 17, 24, 16, 21, 18, 15, 22, 17, 20];
const widthsB = [17, 21, 16, 23, 15, 20, 18, 22, 16, 19, 24, 17];

let mm: ReturnType<typeof gsap.matchMedia> | null = null;
let headerMm: ReturnType<typeof gsap.matchMedia> | null = null;

function openViewer(index: number, event: MouseEvent) {
  sourceEl.value = event.currentTarget as HTMLElement;
  viewerStartIndex.value = index;
  viewerOpen.value = true;
}

onMounted(async () => {
  await nextTick();

  mm = gsap.matchMedia();

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const stage = stageRef.value;
    const rowA = rowARef.value;
    const rowB = rowBRef.value;
    if (!stage || !rowA || !rowB) return;

    pinned.value = true;

    const distanceA = () => Math.max(0, rowA.scrollWidth - stage.clientWidth);
    const distanceB = () => Math.max(0, rowB.scrollWidth - stage.clientWidth);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${Math.max(distanceA(), distanceB())}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline.to(rowA, { x: () => -distanceA(), ease: "none" }, 0);
    timeline.fromTo(
      rowB,
      { x: () => -distanceB() },
      { x: 0, ease: "none" },
      0,
    );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      pinned.value = false;
      gsap.set([rowA, rowB], { clearProps: "transform" });
    };
  });

  if (headerRef.value) {
    headerMm = gsap.matchMedia();
    headerMm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!headerRef.value) return;
      gsap.from(headerRef.value.children, {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.value,
          start: "top 84%",
          once: true,
        },
      });
    });
  }
});

onBeforeUnmount(() => {
  mm?.revert();
  headerMm?.revert();
});
</script>

<template>
  <section id="gallery-section" class="relative w-full scroll-mt-24">
    <div class="mx-auto max-w-7xl px-6 pt-32 md:px-10 md:pt-44">
      <div ref="headerRef">
        <UiSectionLabel index="05" label="Galeri" />

        <div class="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2
            class="max-w-3xl font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.95] tracking-[-0.025em]"
          >
            Potret dari Penampilan Apostrophe
          </h2>
          <div class="flex items-center gap-4">
            <span class="h-px w-10 bg-bone/20" />
            <p class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash">
              24 frames
            </p>
          </div>
        </div>

        <p class="mt-6 max-w-md text-[15px] leading-relaxed text-ash">
          Dokumentasi dari penampilan band Apostrophe di berbagai acara.
        </p>
      </div>
    </div>

    <div
      ref="stageRef"
      class="relative mt-14 flex flex-col justify-center gap-3 overflow-hidden py-8 md:mt-20 md:gap-4 lg:min-h-[100svh] lg:py-0"
    >
      <!-- Row one -->
      <div
        :class="
          pinned
            ? 'overflow-hidden'
            : 'no-scrollbar snap-x snap-mandatory overflow-x-auto'
        "
      >
        <div
          ref="rowARef"
          class="flex w-max items-stretch gap-3 will-change-transform lg:gap-4"
        >
          <button
            v-for="(image, idx) in rowOne"
            :key="image"
            type="button"
            class="group relative h-[clamp(150px,32vh,360px)] shrink-0 snap-start overflow-hidden rounded-editorial bg-ink-soft"
            :style="{ width: `clamp(150px, ${widthsA[idx]}vw, 560px)` }"
            data-cursor="View"
            :aria-label="`Buka dokumentasi ${idx + 1}`"
            @click="openViewer(idx, $event)"
          >
            <img
              :src="image"
              alt=""
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              class="grade-warm h-full w-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
            >
          </button>
        </div>
      </div>

      <!-- Row two (counter-scroll) -->
      <div
        :class="
          pinned
            ? 'overflow-hidden'
            : 'no-scrollbar snap-x snap-mandatory overflow-x-auto'
        "
      >
        <div
          ref="rowBRef"
          class="flex w-max items-stretch gap-3 will-change-transform lg:gap-4"
        >
          <button
            v-for="(image, idx) in rowTwo"
            :key="image"
            type="button"
            class="group relative h-[clamp(130px,26vh,300px)] shrink-0 snap-start overflow-hidden rounded-editorial bg-ink-soft"
            :style="{ width: `clamp(140px, ${widthsB[idx]}vw, 520px)` }"
            data-cursor="View"
            :aria-label="`Buka dokumentasi ${idx + 13}`"
            @click="openViewer(idx + 12, $event)"
          >
            <img
              :src="image"
              alt=""
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
              class="grade-warm h-full w-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
            >
          </button>
        </div>
      </div>
    </div>

    <div
      class="mx-auto flex max-w-7xl items-center justify-between px-6 py-10 md:px-10"
    >
      <p class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash">
        Klik untuk melihat
      </p>
      <span class="h-px flex-1 bg-bone/10 mx-6" aria-hidden="true" />
      <p class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash">
        Tasikmalaya
      </p>
    </div>

    <ImageViewer
      v-if="viewerOpen"
      :images="imagesGallery"
      :start-index="viewerStartIndex"
      :source-el="sourceEl"
      @close="viewerOpen = false"
    />
  </section>
</template>
