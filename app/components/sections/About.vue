<script setup lang="ts">
import { motion } from "motion-v";
</script>

<template>
  <section
    id="about-section"
    class="relative w-full max-w-[1366px] min-h-[768px] mx-auto -scroll-mt-4"
  >
    <motion.div
      :initial="{
        opacity: 0,
        y: 100,
      }"
      :while-in-view="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
        },
      }"
      :in-view-options="{ amount: 0.3, once: true }"
      class="relative flex px-6 md:px-8 py-48 items-center justify-center z-10"
    >
      <div class="flex gap-4 flex-col justify-center items-center">
        <h1 class="w-fit text-[1.5rem] md:text-[1.8rem] font-bold">
          Tentang Kami
        </h1>
        <h2
          class="w-fit max-w-200 text-center text-[2.6rem] md:text-[3.2rem] md:leading-[72px] text-zinc-200"
        >
          Mari Berkenalan dengan Kami
        </h2>
        <p
          class="max-w-200 w-full text-center leading-10 md:text-lg text-zinc-300"
        >
          <span class="font-bold">Apostrophe</span> merupakan band yang
          terbentuk sejak 2023 di Kota Tasikmalaya. Pada dasarnya band ini
          merupakan band sekumpulan mahasiswa yang memiliki hobi yang sama
          dibidang musik. Terinspirasi dari konsep bahasa pemrograman yang
          sering menggunakan
          <span class="font-bold">"Tanda Petik ( ' )"</span> untuk
          mendefinisikan karakter atau string. Sehingga kami memberi nama band
          "Apostrophe".
        </p>
      </div>
    </motion.div>
  </section>
</template>
