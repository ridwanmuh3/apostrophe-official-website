<script setup lang="ts">
useSmoothScroll();
</script>

<template>
  <div class="relative min-h-screen w-full overflow-x-clip bg-ink text-bone">
    <a
      href="#main-content"
      data-no-autoscroll
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-editorial focus:border focus:border-champagne/40 focus:bg-bone focus:px-5 focus:py-3 focus:font-oxanium focus:text-[10px] focus:uppercase focus:tracking-[0.24em] focus:text-ink"
    >
      Lewati ke konten
    </a>
    <UiGrainOverlay />
    <UiCustomCursor />
    <UiScrollProgress />
    <AppHeader />
    <main id="main-content" tabindex="-1" class="focus:outline-none">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
