<script setup lang="ts">
import socialMediaLinks from "~/assets/data/socialMediaLinks";
</script>

<template>
  <div class="flex gap-5 items-center">
    <NuxtLink
      v-for="{ name, icon, link } in socialMediaLinks"
      :key="name"
      :to="link"
      target="_blank"
      rel="external noreferrer"
      class="text-zinc-500 hover:text-white transition-colors duration-300"
    >
      <Icon class="text-xl" :name="icon" />
    </NuxtLink>
  </div>
</template>
