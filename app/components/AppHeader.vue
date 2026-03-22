<script setup lang="ts">
import navMenus from "~/assets/data/navMenus";

const { gsap } = useGsap();

const headerRef = ref<HTMLElement | null>(null);
const menuOverlayRef = ref<HTMLElement | null>(null);
const scrolled = ref(false);
const menuOpen = ref(false);

onMounted(() => {
  gsap.fromTo(
    headerRef.value,
    { y: -80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay: 1.8,
      ease: "power3.out",
    },
  );

  window.addEventListener(
    "scroll",
    () => {
      scrolled.value = window.scrollY > 60;
    },
    { passive: true },
  );
});

const openMenu = () => {
  menuOpen.value = true;
  document.body.classList.add("overflow-hidden");
  nextTick(() => {
    gsap.fromTo(
      menuOverlayRef.value,
      { clipPath: "circle(0% at calc(100% - 2rem) 2rem)" },
      {
        clipPath: "circle(150% at calc(100% - 2rem) 2rem)",
        duration: 0.6,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      ".mobile-nav-link",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.25,
        ease: "power2.out",
      },
    );
  });
};

const closeMenu = () => {
  gsap.to(menuOverlayRef.value, {
    clipPath: "circle(0% at calc(100% - 2rem) 2rem)",
    duration: 0.45,
    ease: "power3.in",
    onComplete: () => {
      menuOpen.value = false;
      document.body.classList.remove("overflow-hidden");
    },
  });
};
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 inset-x-0 z-50 opacity-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500"
    :class="
      scrolled
        ? 'bg-zinc-950/80 backdrop-blur-xl border-zinc-800/50'
        : 'bg-transparent border-transparent'
    "
  >
    <div
      class="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between"
    >
      <NuxtLink to="#home-section" class="flex items-center gap-3">
        <img
          class="rounded-full w-10 h-10"
          src="/logo/apostrophe.webp"
          alt="Apostrophe Band Logo"
        />
        <span class="font-semibold text-lg tracking-tight hidden sm:inline"
          >Apostrophe</span
        >
      </NuxtLink>

      <nav class="md:flex hidden gap-8 items-center">
        <NuxtLink
          v-for="menu in navMenus"
          :key="menu.name"
          :to="menu.path"
          class="text-sm font-medium tracking-wide text-zinc-400 hover:text-white transition-colors duration-300"
        >
          {{ menu.name }}
        </NuxtLink>
      </nav>

      <button
        class="relative flex md:hidden items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-zinc-800/60 transition-colors duration-300 active:scale-95"
        aria-label="Toggle navigation menu"
        @click="openMenu"
      >
        <Icon class="text-2xl" name="mdi:menu" />
      </button>
    </div>
  </header>

  <!-- Mobile menu overlay -->
  <div
    v-if="menuOpen"
    ref="menuOverlayRef"
    class="fixed inset-0 z-[60] bg-zinc-950 flex flex-col items-center justify-center"
    style="clip-path: circle(0% at calc(100% - 2rem) 2rem)"
  >
    <button
      class="absolute top-6 right-6 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors duration-300 cursor-pointer active:scale-95"
      aria-label="Close navigation menu"
      @click="closeMenu"
    >
      <Icon class="text-2xl" name="mdi:close" />
    </button>

    <nav class="flex flex-col items-center gap-2">
      <NuxtLink
        v-for="menu in navMenus"
        :key="menu.name"
        :to="menu.path"
        class="mobile-nav-link text-3xl font-semibold tracking-tight text-zinc-300 hover:text-white px-8 py-4 transition-colors duration-300"
        @click="closeMenu"
      >
        {{ menu.name }}
      </NuxtLink>
    </nav>
  </div>
</template>
