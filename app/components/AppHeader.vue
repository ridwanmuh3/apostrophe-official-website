<script setup lang="ts">
import navMenus from "~/assets/data/navMenus";
import { lockScroll, scrollToSection, unlockScroll } from "~/composables/useSmoothScroll";

const { gsap, ScrollTrigger } = useGsap();

const root = ref<HTMLElement | null>(null);
const overlay = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLElement | null>(null);
const menuTrigger = ref<HTMLElement | null>(null);

const scrolled = ref(false);
const inverted = ref(false);
const menuOpen = ref(false);

let scrollHandler: (() => void) | null = null;
let invertTrigger: ScrollTrigger | null = null;
let mm: ReturnType<typeof gsap.matchMedia> | null = null;

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 24;
  };
  scrollHandler();
  window.addEventListener("scroll", scrollHandler, { passive: true });

  // Header inversion over the bone About interlude.
  nextTick(() => {
    const about = document.querySelector("#about-section");
    if (!about) return;
    invertTrigger = ScrollTrigger.create({
      trigger: about,
      start: "top 76px",
      end: "bottom 76px",
      onToggle: (self) => {
        inverted.value = self.isActive;
      },
    });
  });

  mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (!root.value) return;
    gsap.from(root.value, {
      yPercent: -110,
      duration: 1,
      delay: 0.25,
      ease: "expo.out",
    });
  });

  document.addEventListener("keydown", onGlobalKeydown);
});

onBeforeUnmount(() => {
  if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
  document.removeEventListener("keydown", onGlobalKeydown);
  invertTrigger?.kill();
  mm?.revert();
  unlockScroll();
});

function onGlobalKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && menuOpen.value) closeMenu();
}

async function openMenu() {
  menuOpen.value = true;
  lockScroll();
  await nextTick();
  closeButton.value?.focus();

  if (!overlay.value || prefersReduced()) return;

  gsap.fromTo(
    overlay.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.35, ease: "power2.out" },
  );
  gsap.fromTo(
    overlay.value.querySelectorAll(".mobile-nav-inner"),
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 0.85,
      stagger: 0.07,
      delay: 0.08,
      ease: "expo.out",
    },
  );
}

function closeMenu(scrollTarget?: string) {
  if (!menuOpen.value) return;

  const finish = () => {
    menuOpen.value = false;
    unlockScroll();
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      if (window.location.hash !== scrollTarget) {
        history.pushState(null, "", scrollTarget);
      }
    } else {
      menuTrigger.value?.focus();
    }
  };

  if (!overlay.value || prefersReduced()) {
    finish();
    return;
  }

  gsap.to(overlay.value, {
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: finish,
  });
}

function trapMenu(event: KeyboardEvent) {
  if (event.key !== "Tab" || !overlay.value) return;

  const focusables = Array.from(
    overlay.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
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
</script>

<template>
  <header
    ref="root"
    class="fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500"
    :class="[
      inverted ? 'text-ink' : 'text-bone',
      inverted ? 'border-ink/10' : 'border-bone/10',
      scrolled ? (inverted ? 'bg-bone/85' : 'bg-ink/85') : 'bg-transparent',
    ]"
  >
    <div
      class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10"
    >
      <NuxtLink
        to="#home-section"
        class="group flex items-center gap-3"
        aria-label="Apostrophe — kembali ke atas"
      >
        <img
          src="/logo/apostrophe.webp"
          alt=""
          width="32"
          height="32"
          class="h-8 w-8 rounded-full"
        >
        <span class="font-display text-xl leading-none tracking-tight">
          Apostrophe
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-9 lg:flex" aria-label="Navigasi utama">
        <NuxtLink
          v-for="(menu, idx) in navMenus"
          :key="menu.name"
          :to="menu.path"
          class="group relative flex items-baseline gap-2 text-[13px] font-light tracking-[0.01em] opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          <span
            class="font-oxanium text-[9px] tracking-[0.2em]"
            :class="inverted ? 'text-ink/45' : 'text-champagne/75'"
          >
            0{{ idx + 1 }}
          </span>
          <span>{{ menu.name }}</span>
          <span
            aria-hidden="true"
            class="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-editorial group-hover:scale-x-100"
          />
        </NuxtLink>
      </nav>

      <button
        ref="menuTrigger"
        type="button"
        class="flex items-center gap-3 py-1 lg:hidden"
        aria-label="Buka menu navigasi"
        aria-controls="mobile-menu"
        :aria-expanded="menuOpen"
        @click="openMenu"
      >
        <span class="font-oxanium text-[9px] uppercase tracking-[0.3em] opacity-60">
          Menu
        </span>
        <span aria-hidden="true" class="flex w-6 flex-col gap-1.5">
          <span class="h-px w-full bg-current" />
          <span class="h-px w-full bg-current" />
        </span>
      </button>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="menuOpen"
      id="mobile-menu"
      ref="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu navigasi"
      class="fixed inset-0 z-[85] flex flex-col bg-ink px-6 py-6 text-bone md:px-10"
      @keydown.esc="closeMenu()"
      @keydown.tab="trapMenu"
    >
      <div class="flex items-center justify-between">
        <span class="font-oxanium text-[10px] uppercase tracking-[0.3em] text-ash">
          Menu
        </span>
        <button
          ref="closeButton"
          type="button"
          class="flex items-center gap-3 py-2 font-oxanium text-[10px] uppercase tracking-[0.3em] text-bone/80 transition-colors hover:text-bone"
          aria-label="Tutup menu navigasi"
          @click="closeMenu()"
        >
          Tutup
          <span aria-hidden="true" class="relative block h-4 w-4">
            <span class="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span class="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <nav class="flex flex-1 flex-col justify-center" aria-label="Navigasi seluler">
        <div
          v-for="(menu, idx) in navMenus"
          :key="menu.name"
          class="overflow-hidden"
        >
          <a
            :href="menu.path"
            data-no-autoscroll
            class="mobile-nav-inner flex items-baseline gap-5 py-1 font-display text-[clamp(2.5rem,10vw,5rem)] leading-[1.08] tracking-[-0.02em]"
            @click.prevent="closeMenu(menu.path)"
          >
            <span class="font-oxanium text-[10px] tracking-[0.3em] text-champagne">
              0{{ idx + 1 }}
            </span>
            <span>{{ menu.name }}</span>
          </a>
        </div>
      </nav>

      <div class="flex items-center justify-between border-t border-bone/10 pt-5">
        <p class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash">
          Tasikmalaya · Indonesia
        </p>
        <SocialMediaLinks />
      </div>
    </div>
  </Teleport>
</template>
