<script setup lang="ts">
  import imagesGallery from "~/assets/data/imagesGallery";

  const { gsap } = useGsap();
  const sectionRef = ref<HTMLElement | null>(null);
  const headerRef = ref<HTMLElement | null>(null);
  const gridRef = ref<HTMLElement | null>(null);
  const controlsRef = ref<HTMLElement | null>(null);

  const viewerOpen = ref(false);
  const viewerStartIndex = ref(0);

  const openViewer = (pageImageIdx: number) => {
    viewerStartIndex.value =
      currentGalleryIndex.value * maxImagePerPage + pageImageIdx;
    viewerOpen.value = true;
  };

  const currentGalleryIndex = ref(0);
  const maxImagePerPage = 8;
  const totalPages = Math.ceil(imagesGallery.length / maxImagePerPage);
  const pageDelay = 8000;
  const transitioning = ref(false);

  const currentImages = computed(() =>
    imagesGallery.slice(
      currentGalleryIndex.value * maxImagePerPage,
      currentGalleryIndex.value * maxImagePerPage + maxImagePerPage,
    ),
  );

  const changePage = async (newIndex: number) => {
    if (transitioning.value || newIndex === currentGalleryIndex.value) return;
    transitioning.value = true;

    const direction = newIndex > currentGalleryIndex.value ? 1 : -1;

    await gsap.to(gridRef.value, {
      x: direction * -60,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    });

    currentGalleryIndex.value = newIndex;
    await nextTick();

    gsap.fromTo(
      gridRef.value,
      { x: direction * 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          transitioning.value = false;
        },
      },
    );
  };

  const { start } = useInterval(() => {
    const next =
      currentGalleryIndex.value >= totalPages - 1
        ? 0
        : currentGalleryIndex.value + 1;
    changePage(next);
  }, pageDelay);

  const handleNav = (index: number) => {
    changePage(index);
    start();
  };

  onMounted(() => {
    if (headerRef.value) {
      gsap.fromTo(
        headerRef.value.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.value,
            start: "top 80%",
          },
        },
      );
    }

    if (controlsRef.value) {
      gsap.fromTo(
        controlsRef.value,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: controlsRef.value,
            start: "top 85%",
          },
        },
      );
    }
  });
</script>

<template>
  <section id="gallery-section" ref="sectionRef" class="relative w-full overflow-hidden scroll-mt-16">
    <!-- Mesh gradient accents (contained inside section) -->
    <div
      class="absolute top-1/3 left-10 w-[350px] h-[350px] bg-cyan-500/6 rounded-full blur-[140px] pointer-events-none" />
    <div
      class="absolute top-20 right-20 w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-[120px] pointer-events-none" />

    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-44">
      <!-- Section header -->
      <div ref="headerRef" class="flex flex-col items-center text-center mb-12 md:mb-16">
        <span class="text-xs font-medium tracking-[0.25em] uppercase text-zinc-500 mb-6">
          Galeri
        </span>
        <h2
          class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-tight tracking-tight text-white max-w-4xl">
          Potret dari Penampilan Apostrophe
        </h2>
        <p class="mt-6 text-base md:text-lg text-zinc-400 max-w-xl">
          Dokumentasi dari penampilan band Apostrophe di berbagai acara.
        </p>
      </div>

      <!-- Gallery grid + nav -->
      <div ref="controlsRef">
        <div ref="gridRef" class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div
            v-for="(image, idx) in currentImages"
            :key="`${currentGalleryIndex}-${idx}`"
            class="aspect-square overflow-hidden rounded-lg cursor-pointer"
            @click="openViewer(idx)"
          >
            <img
              :src="image"
              :loading="idx < 4 ? 'eager' : 'lazy'"
              alt="Gallery image"
              class="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
            >
          </div>
        </div>

        <div class="flex items-center justify-center gap-4 mt-8">
          <button
            class="p-3 border border-zinc-700 rounded-lg transition-colors duration-300 cursor-pointer hover:border-zinc-400 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-700 flex items-center"
            :disabled="currentGalleryIndex === 0" @click="handleNav(currentGalleryIndex - 1)">
            <Icon name="mdi:arrow-left" class="text-lg" />
          </button>

          <div class="flex items-center gap-2">
            <button v-for="i in totalPages" :key="i"
              class="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer" :class="currentGalleryIndex === i - 1
                ? 'bg-white w-6'
                : 'bg-zinc-600 hover:bg-zinc-400'
                " @click="handleNav(i - 1)" />
          </div>

          <button
            class="p-3 border border-zinc-700 rounded-lg transition-colors duration-300 cursor-pointer hover:border-zinc-400 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-700 flex items-center"
            :disabled="currentGalleryIndex === totalPages - 1" @click="handleNav(currentGalleryIndex + 1)">
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>
      </div>
    </div>

    <ImageViewer
      v-if="viewerOpen"
      :images="imagesGallery"
      :start-index="viewerStartIndex"
      @close="viewerOpen = false"
    />
  </section>
</template>
