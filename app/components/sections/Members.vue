<script setup lang="ts">
import members from "~/assets/data/members";
import { motion } from "motion-v";
</script>

<template>
  <section
    id="members-section"
    class="relative w-full min-h-screen bg-zinc-900 -scroll-mt-4"
  >
    <div
      class="relative min-h-screen max-w-[1366px] w-full mx-auto flex px-6 md:px-8 py-48 items-center justify-center flex-col gap-12 z-10"
    >
      <div class="flex gap-4 flex-col justify-center items-center">
        <h1 class="w-fit text-[1.5rem] md:text-[1.8rem] font-bold">Personil</h1>
        <p
          class="w-full max-w-200 text-center text-[2.6rem] md:text-[3.2rem] md:leading-[72px] text-zinc-200"
        >
          Berkenalan Lebih Dekat dengan Personil Band Apostrophe
        </p>
      </div>
      <div class="w-full flex flex-col gap-32">
        <motion.div
          v-for="member in members"
          :key="member.nickname"
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :while-in-view="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              type: 'tween',
            },
          }"
          :in-view-options="{ amount: 0.2, once: true }"
          class="w-full flex gap-8 md:gap-12 items-center flex-wrap flex-col md:flex-row md:even:flex-row-reverse md:justify-start justify-center text-center md:text-start"
        >
          <img
            class="grayscale w-132 h-132 object-cover object-center"
            :loading="'eager'"
            :src="member.image"
          />
          <div class="space-y-2 md:space-y-4">
            <h2
              class="text-3xl md:text-4xl leading-12 md:leading-14 text-zinc-200"
            >
              {{ member.fullname }} ({{ member.nickname }})
            </h2>
            <h3 class="font-bold leading-12 text-xl md:text-2xl">
              {{ member.role }}
            </h3>
            <p class="max-w-160 md:text-lg leading-10 text-zinc-300">
              {{ member.description }}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>
