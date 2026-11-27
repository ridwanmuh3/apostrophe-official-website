<script setup lang="ts">
useSmoothScroll();
</script>

<template>
  <div class="relative min-h-screen w-full overflow-x-clip bg-ink text-bone">
    <UiGrainOverlay />
    <UiCustomCursor />
    <UiScrollProgress />
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
