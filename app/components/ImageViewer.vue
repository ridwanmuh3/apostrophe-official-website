<script setup lang="ts">
import { lockScroll, unlockScroll } from "~/composables/useSmoothScroll";

const { gsap, Flip } = useGsap();

const props = defineProps<{
  images: string[];
  startIndex: number;
  sourceEl?: HTMLElement | null;
}>();

const emit = defineEmits<{ close: [] }>();

const currentIndex = ref(props.startIndex);
const overlay = ref<HTMLElement | null>(null);
const image = ref<HTMLImageElement | null>(null);
const closeButton = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const closing = ref(false);

const previousFocus = ref<HTMLElement | null>(null);

const currentImage = computed(() => props.images[currentIndex.value] ?? "");
const hasNext = computed(() => currentIndex.value < props.images.length - 1);
const hasPrev = computed(() => currentIndex.value > 0);

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function preload(index: number) {
  const src = props.images[index];
  if (!src) return;
  const loader = new Image();
  loader.src = src;
}

watch(currentIndex, (index) => {
  preload(index - 1);
  preload(index + 1);
});

function goTo(index: number) {
  if (isAnimating.value || closing.value) return;
  if (index < 0 || index >= props.images.length) return;
  if (index === currentIndex.value) return;

  if (prefersReduced()) {
    currentIndex.value = index;
    return;
  }

  isAnimating.value = true;
  const direction = index > currentIndex.value ? 1 : -1;

  gsap.to(image.value, {
    x: direction * -26,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      currentIndex.value = index;
      nextTick(() => {
        gsap.fromTo(
          image.value,
          { x: direction * 26, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power3.out",
            onComplete: () => {
              isAnimating.value = false;
            },
          },
        );
      });
    },
  });
}

function close() {
  if (closing.value) return;
  closing.value = true;

  const finish = () => emit("close");

  if (!overlay.value || prefersReduced()) {
    finish();
    return;
  }

  const timeline = gsap.timeline({ onComplete: finish });

  timeline.to(
    overlay.value,
    { opacity: 0, duration: 0.45, ease: "power2.in" },
    0,
  );

  // Only fly back to the thumbnail the viewer was opened from.
  const sourceImage = props.sourceEl?.querySelector("img") ?? props.sourceEl;
  if (
    image.value &&
    sourceImage &&
    currentIndex.value === props.startIndex
  ) {
    const fit = Flip.fit(image.value, sourceImage, {
      duration: 0.6,
      ease: "power3.inOut",
      scale: true,
    });

    if (fit) {
      timeline.add(fit as Parameters<typeof timeline.add>[0], 0);
    }
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    close();
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goTo(currentIndex.value + 1);
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goTo(currentIndex.value - 1);
    return;
  }

  if (event.key !== "Tab" || !overlay.value) return;

  const focusables = Array.from(
    overlay.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null);

  if (!focusables.length) return;

  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) close();
}

onMounted(async () => {
  previousFocus.value = document.activeElement as HTMLElement | null;

  lockScroll();
  document.addEventListener("keydown", onKeydown);

  await nextTick();
  closeButton.value?.focus();

  preload(props.startIndex - 1);
  preload(props.startIndex + 1);

  if (image.value && !image.value.complete) {
    await new Promise<void>((resolve) => {
      const done = () => resolve();
      image.value?.addEventListener("load", done, { once: true });
      image.value?.addEventListener("error", done, { once: true });
      window.setTimeout(done, 700);
    });
  }

  if (closing.value || !overlay.value || prefersReduced()) return;

  gsap.fromTo(
    overlay.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, ease: "power2.out" },
  );

  const sourceImage = props.sourceEl?.querySelector("img") ?? props.sourceEl;
  if (image.value && sourceImage) {
    Flip.fit(image.value, sourceImage, {
      runBackwards: true,
      duration: 0.7,
      ease: "expo.out",
      scale: true,
    });
  } else if (image.value) {
    gsap.from(image.value, {
      opacity: 0,
      y: 18,
      duration: 0.6,
      ease: "expo.out",
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
  unlockScroll();

  const target = props.sourceEl ?? previousFocus.value;
  target?.focus?.({ preventScroll: true });
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri Apostrophe"
      class="fixed inset-0 z-[90] flex flex-col bg-ink"
    >
      <div
        class="flex items-center justify-between border-b border-bone/10 px-5 py-4 md:px-8"
      >
        <p
          class="font-oxanium text-[10px] uppercase tracking-[0.28em] text-ash"
          aria-live="polite"
        >
          {{ String(currentIndex + 1).padStart(2, "0") }} /
          {{ String(images.length).padStart(2, "0") }}
        </p>

        <button
          ref="closeButton"
          type="button"
          class="flex items-center gap-3 py-1 font-oxanium text-[10px] uppercase tracking-[0.28em] text-bone/80 transition-colors hover:text-bone"
          aria-label="Tutup pratinjau"
          @click="close"
        >
          Tutup
          <span aria-hidden="true" class="relative block h-4 w-4">
            <span class="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span class="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <div
        class="relative flex flex-1 items-center justify-center px-4 py-6 md:px-20"
        @click="onBackdrop"
      >
        <button
          type="button"
          :disabled="!hasPrev"
          class="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-editorial border border-bone/20 bg-ink/80 text-bone transition-colors hover:border-champagne hover:text-champagne disabled:pointer-events-none disabled:opacity-25 md:left-6"
          aria-label="Gambar sebelumnya"
          @click="goTo(currentIndex - 1)"
        >
          <Icon name="mdi:arrow-left" class="text-lg" />
        </button>

        <img
          ref="image"
          :src="currentImage"
          :alt="`Dokumentasi penampilan Apostrophe ${currentIndex + 1}`"
          class="grade-warm max-h-[78svh] max-w-full select-none object-contain ring-1 ring-bone/10"
          draggable="false"
          decoding="async"
        >

        <button
          type="button"
          :disabled="!hasNext"
          class="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-editorial border border-bone/20 bg-ink/80 text-bone transition-colors hover:border-champagne hover:text-champagne disabled:pointer-events-none disabled:opacity-25 md:right-6"
          aria-label="Gambar berikutnya"
          @click="goTo(currentIndex + 1)"
        >
          <Icon name="mdi:arrow-right" class="text-lg" />
        </button>
      </div>

      <div
        class="flex items-center justify-between border-t border-bone/10 px-5 py-4 md:px-8"
      >
        <p class="font-oxanium text-[9px] uppercase tracking-[0.26em] text-ash">
          Gunakan ← → untuk menjelajah
        </p>
        <p class="font-oxanium text-[9px] uppercase tracking-[0.26em] text-ash">
          Apostrophe · Galeri
        </p>
      </div>
    </div>
  </Teleport>
</template>
