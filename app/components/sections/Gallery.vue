<script setup lang="ts">
import imagesGallery from "~/assets/data/imagesGallery";

const currentGalleryIndex = useState("currentGalleryIndex", () => 0);
const maxImagePerPage = 8;
const totalGalleryIndex = Math.ceil(imagesGallery.length / maxImagePerPage);
const pageDelay = 8 * 1000;

const setCurrentGalleryIndex = (index: number) => {
  currentGalleryIndex.value = index;
};

const currentImagesGallery = computed(() =>
  imagesGallery.slice(
    currentGalleryIndex.value * maxImagePerPage,
    currentGalleryIndex.value * maxImagePerPage + maxImagePerPage
  )
);

const { start, stop: _ } = useInterval(() => {
  if (currentGalleryIndex.value === totalGalleryIndex - 1) {
    setCurrentGalleryIndex(0);
  } else {
    setCurrentGalleryIndex(currentGalleryIndex.value + 1);
  }
}, pageDelay);

const carouselDotIndicatorHandler = (index: number) => {
  setCurrentGalleryIndex(index);
  start();
};
</script>

<template>
  <section
    id="gallery-section"
    class="relative w-full max-w-[1366px] mx-auto min-h-[768px] -scroll-mt-4"
  >
    <div
      class="relative h-full flex flex-col gap-8 px-6 md:px-8 py-48 items-center justify-center z-10 overflow-hidden"
    >
      <div class="flex gap-4 flex-col justify-center items-center">
        <h1 class="w-fit text-[1.5rem] md:text-[1.8rem] font-bold">Galeri</h1>
        <h2
          class="w-fit max-w-200 text-center text-[2.6rem] md:text-[3.2rem] md:leading-[72px] text-zinc-300"
        >
          Potret dari Penampilan Apostrophe
        </h2>
        <p
          class="max-w-200 w-full text-center leading-10 md:text-lg text-zinc-300"
        >
          Dokumentasi dari penampilan band Apostrophe di berbagai acara.
        </p>
      </div>
      <div class="relative flex items-center gap-4 md:gap-8">
        <button
          key="previousGallery"
          :class="
            'py-3 px-3  border border-zinc-300 transition-all duration-250 ease-in-out flex items-center justify-center ' +
            (currentGalleryIndex === 0
              ? 'border-zinc-500 text-zinc-500'
              : 'bg-none cursor-pointer')
          "
          :disabled="currentGalleryIndex === 0"
          @click="carouselDotIndicatorHandler(currentGalleryIndex - 1)"
        >
          <Icon name="mdi:arrow-left" class="text-xl" />
        </button>
        <CarouselGallery
          :images="currentImagesGallery"
          :current-gallery-index="currentGalleryIndex"
        />
        <button
          key="nextGallery"
          :class="
            'py-3 px-3  border border-zinc-300 transition-all duration-250 ease-in-out flex items-center justify-center ' +
            (currentGalleryIndex === totalGalleryIndex - 1
              ? 'border-zinc-500 text-zinc-500'
              : 'bg-none cursor-pointer')
          "
          :disabled="currentGalleryIndex === totalGalleryIndex - 1"
          @click="carouselDotIndicatorHandler(currentGalleryIndex + 1)"
        >
          <Icon name="mdi:arrow-right" class="text-xl" />
        </button>
      </div>
    </div>
  </section>
</template>
