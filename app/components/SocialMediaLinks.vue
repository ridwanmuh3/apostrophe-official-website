<script setup lang="ts">
import socialMediaLinks from "~/assets/data/socialMediaLinks";
</script>

<template>
  <div class="flex gap-4 justify-center items-center">
    <a
      v-for="{ name, icon, link } in socialMediaLinks"
      :key="name"
      :href="link"
      target="_blank"
      rel="external noreferrer"
      class="text-2xl text-zinc-200 hover: duration-300 transition-all"
    >
      <Icon class="text-3xl" :name="icon" />
    </a>
  </div>
</template>
