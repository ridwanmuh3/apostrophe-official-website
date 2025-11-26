<!-- TODO: Implement viewer for image on gallery -->
<script setup lang="ts">
type PropsType = {
  imageUrl: string;
};

const props = defineProps<PropsType>();
</script>

<template>
  <div role="image-viewer"></div>
</template>
