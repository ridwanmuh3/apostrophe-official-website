<script setup lang="ts">
import { motion } from "motion-v";
</script>

<template>
  <section id="cta-section" class="relative h-fit bg-zinc-900">
    <motion.div
      :initial="{
        opacity: 0,
        y: 50,
      }"
      :while-in-view="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          type: 'tween',
        },
      }"
      :in-view-options="{ amount: 0.3, once: true }"
      class="relative w-full max-w-[1366px] mx-auto flex px-6 md:px-8 py-48 items-center justify-center z-10"
    >
      <div class="flex gap-8 flex-col justify-center items-center">
        <h2
          class="w-fit max-w-200 text-center text-[2.6rem] md:text-[3.2rem] md:leading-14 text-zinc-200"
        >
          Hubungi Kami
        </h2>
        <p
          class="max-w-160 w-full text-center leading-10 text-lg text-zinc-200"
        >
          Ingin mengetahui kami lebih jauh atau tertarik untuk mendatangkan kami
          di acara anda? hubungi kami sekarang!
        </p>
        <div>
          <a
            class="flex items-center gap-4 py-4 px-10 border text-lg hover:text-green-400 transition-all duration-250"
            href="https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih"
            target="_blank"
            rel="external noreferrer"
          >
            <Icon class="text-3xl" name="ic:baseline-whatsapp" />
            <span>Hubungi Melalui Whatsapp</span>
          </a>
        </div>
      </div>
    </motion.div>
  </section>
</template>
