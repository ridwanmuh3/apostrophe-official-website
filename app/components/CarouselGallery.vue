<script setup lang="ts">
import { motion } from "motion-v";

type PropsType = {
  images: string[];
  currentGalleryIndex?: number;
};

const props = defineProps<PropsType>();
const direction = useState<number>("direction", () => 1);
const prevIndex = useState<number>(
  "prevIndex",
  () => props.currentGalleryIndex || 0,
);

watch(
  () => props.currentGalleryIndex,
  (newIndex, oldIndex) => {
    if (newIndex !== undefined && oldIndex !== undefined) {
      direction.value = newIndex > oldIndex ? 1 : -1;
      prevIndex.value = oldIndex;
    }
  },
);

const uniqueKey = computed(() => {
  return `gallery-${props.currentGalleryIndex}-${props.images.join("-")}`;
});
</script>

<template>
  <div class="overflow-hidden relative max-h-165 md:max-h-136">
    <motion.div
      :key="uniqueKey"
      :initial="{ x: direction * 100, opacity: 0 }"
      :animate="{ x: 0, opacity: 1 }"
      :exit="{ x: direction * -100, opacity: 0 }"
      :transition="{
        duration: 0.8,
        type: 'tween',
        ease: 'easeInOut',
      }"
      class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 h-fit"
    >
      <div
        v-for="(image, idx) in images"
        :key="`${image}-${idx}`"
        class="grid gap-8"
      >
        <img
          :src="image"
          :loading="idx < 4 ? 'eager' : 'lazy'"
          class="h-full max-w-full w-full object-cover object-center aspect-square"
        >
      </div>
    </motion.div>
  </div>
</template>
