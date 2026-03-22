<script setup lang="ts">
const { gsap } = useGsap();
const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!contentRef.value) return;

  gsap.fromTo(
    contentRef.value.children,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 80%",
      },
    },
  );
});
</script>

<template>
  <section
    id="about-section"
    ref="sectionRef"
    class="relative w-full overflow-hidden scroll-mt-16"
  >
    <!-- Mesh gradient accents (contained inside section) -->
    <div
      class="absolute top-10 left-10 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[140px] pointer-events-none"
    />
    <div
      class="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/6 rounded-full blur-[130px] pointer-events-none"
    />

    <div
      ref="contentRef"
      class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-44 flex flex-col items-center text-center"
    >
      <span
        class="text-xs font-medium tracking-[0.25em] uppercase text-zinc-500 mb-6"
      >
        Tentang Kami
      </span>

      <h2
        class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-tight tracking-tight text-white max-w-3xl"
      >
        Mari Berkenalan dengan Kami
      </h2>

      <p
        class="mt-8 text-base md:text-lg leading-relaxed text-zinc-400 max-w-2xl"
      >
        <span class="text-white font-medium">Apostrophe</span> merupakan band
        yang terbentuk sejak 2023 di Kota Tasikmalaya. Pada dasarnya band ini
        merupakan band sekumpulan mahasiswa yang memiliki hobi yang sama dibidang
        musik. Terinspirasi dari konsep bahasa pemrograman yang sering
        menggunakan
        <span class="text-white font-medium">"Tanda Petik ( ' )"</span> untuk
        mendefinisikan karakter atau string. Sehingga kami memberi nama band
        "Apostrophe".
      </p>
    </div>
  </section>
</template>
