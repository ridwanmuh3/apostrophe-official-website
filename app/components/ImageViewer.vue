<script setup lang="ts">
  const { gsap } = useGsap();

  const props = defineProps<{
    images: string[];
    startIndex: number;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  const currentIndex = ref(props.startIndex);
  const overlayRef = ref<HTMLElement | null>(null);
  const imageRef = ref<HTMLElement | null>(null);
  const isAnimating = ref(false);

  const currentImage = computed(() => props.images[currentIndex.value]);
  const hasNext = computed(() => currentIndex.value < props.images.length - 1);
  const hasPrev = computed(() => currentIndex.value > 0);

  const goTo = async (index: number) => {
    if (isAnimating.value || index === currentIndex.value) return;
    if (index < 0 || index >= props.images.length) return;
    isAnimating.value = true;

    const direction = index > currentIndex.value ? 1 : -1;

    await gsap.to(imageRef.value, {
      x: direction * -40,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    currentIndex.value = index;
    await nextTick();

    gsap.fromTo(
      imageRef.value,
      { x: direction * 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          isAnimating.value = false;
        },
      },
    );
  };

  const close = () => {
    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => emit("close"),
    });
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight" && hasNext.value) goTo(currentIndex.value + 1);
    if (e.key === "ArrowLeft" && hasPrev.value) goTo(currentIndex.value - 1);
  };

  onMounted(() => {
    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", onKeydown);

    gsap.fromTo(
      overlayRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" },
    );
  });

  onUnmounted(() => {
    document.body.classList.remove("overflow-hidden");
    window.removeEventListener("keydown", onKeydown);
  });
</script>

<template>
  <Teleport to="body">
    <div ref="overlayRef"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm opacity-0"
      @click.self="close">
      <!-- Close button -->
      <button
        class="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors duration-200 cursor-pointer z-10 flex items-center"
        aria-label="Close preview" @click="close">
        <Icon name="mdi:close" class="text-2xl" />
      </button>

      <!-- Counter -->
      <span class="absolute top-6 left-6 text-sm text-zinc-500">
        {{ currentIndex + 1 }} / {{ images.length }}
      </span>

      <!-- Prev button -->
      <button v-if="hasPrev"
        class="absolute left-4 md:left-8 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors duration-200 cursor-pointer z-10 flex items-center"
        aria-label="Previous image" @click="goTo(currentIndex - 1)">
        <Icon name="mdi:chevron-left" class="text-3xl" />
      </button>

      <!-- Image -->
      <div ref="imageRef" class="max-w-[90vw] max-h-[85vh] flex items-center justify-center">
        <img :src="currentImage" alt="Gallery preview"
          class="max-w-full max-h-[85vh] object-contain rounded-lg select-none" draggable="false" />
      </div>

      <!-- Next button -->
      <button v-if="hasNext"
        class="absolute right-4 md:right-8 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors duration-200 cursor-pointer z-10 flex items-center"
        aria-label="Next image" @click="goTo(currentIndex + 1)">
        <Icon name="mdi:chevron-right" class="text-3xl" />
      </button>
    </div>
  </Teleport>
</template>
