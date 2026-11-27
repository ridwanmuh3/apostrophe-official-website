<script setup lang="ts">
import socialMediaLinks from "~/assets/data/socialMediaLinks";
</script>

<template>
  <ul class="flex items-center gap-5">
    <li v-for="{ name, icon, link } in socialMediaLinks" :key="name">
      <NuxtLink
        :to="link"
        target="_blank"
        rel="external noreferrer"
        :aria-label="`Apostrophe di ${name}`"
        data-cursor="Visit"
        class="group flex h-8 w-8 items-center justify-center text-ash transition-colors duration-300 hover:text-champagne"
      >
        <Icon class="text-[20px]" :name="icon" />
      </NuxtLink>
    </li>
  </ul>
</template>
