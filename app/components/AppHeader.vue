<script setup lang="ts">
import navMenus from "~/assets/data/navMenus";
import { motion } from "motion-v";

const { showMenu, menuVisible, isClosing, closeMenu } = useAnimateMenu();
const currentScreenWidth = window.innerWidth;

watch(showMenu, (v) => {
  if (v) {
    menuVisible.value = true;
    document.querySelector("body")?.classList.add("overflow-hidden", "h-full");
  } else {
    document
      .querySelector("body")
      ?.classList.remove("overflow-hidden", "h-full");
  }
});

// onMounted(() => {});
</script>

<template>
  <motion.header
    :initial="{ y: 0 }"
    :transition="{ duration: 0.4, type: 'tween' }"
    class="absolute w-full top-0 inset-x-0 z-100"
  >
    <div
      class="max-w-[1366px] mx-auto px-6 md:px-8 py-6 flex gap-4 items-center justify-between"
    >
      <NuxtImg
        class="rounded-full w-12 h-fit"
        src="/logo/apostrophe-logo.jpg"
        alt="Apostrophe Band Logo"
      />
      <nav
        class="md:flex hidden relative gap-6 items-center font-bold text-zinc-50 text-md"
      >
        <NuxtLink v-for="menu in navMenus" :key="menu.name" :to="menu.path">
          {{ menu.name }}
        </NuxtLink>
      </nav>
      <button
        class="relative flex md:hidden items-center justify-center cursor-pointer hover:bg-zinc-800/50 p-2 rounded-full transition-all duration-300 ease-in-out"
        role="nav-toggler"
        @click="showMenu = !showMenu"
      >
        <Icon class="text-3xl" name="mdi:hamburger-menu" />
      </button>
    </div>
  </motion.header>
  <motion.div
    v-if="menuVisible"
    :initial="{ x: currentScreenWidth, display: 'none' }"
    :animate="
      isClosing
        ? { x: currentScreenWidth, display: 'none' }
        : { x: 0, display: 'flex' }
    "
    :transition="{ duration: 0.4, type: 'tween' }"
    class="fixed isolate inset-0 w-full flex items-center justify-center z-120 bg-zinc-900"
  >
    <button
      class="absolute top-8 right-8 flex items-center cursor-pointer hover:bg-zinc-600/50 p-2 rounded-full transition-all duration-300 ease-in-out"
      role="close-nav-toggler"
      @click="closeMenu()"
    >
      <Icon class="text-3xl" name="mdi:close" />
    </button>
    <nav
      class="w-full flex flex-col items-center font-bold text-zinc-50 text-3xl"
    >
      <NuxtLink
        v-for="menu in navMenus"
        :key="menu.name"
        :to="{ path: menu.path, hash: menu.path }"
        class="w-full px-16 py-6 hover:bg-zinc-600 transition-all duration-300 ease-in-out text-center"
        @click="closeMenu()"
      >
        {{ menu.name }}
      </NuxtLink>
    </nav>
  </motion.div>
</template>
