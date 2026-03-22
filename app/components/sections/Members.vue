<script setup lang="ts">
import members from "~/assets/data/members";

const { gsap } = useGsap();
const sectionRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (headerRef.value) {
    gsap.fromTo(
      headerRef.value.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.value,
          start: "top 80%",
        },
      },
    );
  }

  sectionRef.value?.querySelectorAll(".member-block").forEach((block) => {
    gsap.fromTo(
      block,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
        },
      },
    );
  });
});
</script>

<template>
  <section
    id="members-section"
    ref="sectionRef"
    class="relative w-full bg-zinc-900/30 overflow-hidden scroll-mt-16"
  >
    <!-- Mesh gradient accents (contained inside section) -->
    <div
      class="absolute top-20 right-20 w-[450px] h-[450px] bg-rose-500/6 rounded-full blur-[150px] pointer-events-none"
    />
    <div
      class="absolute bottom-40 left-10 w-[350px] h-[350px] bg-indigo-500/6 rounded-full blur-[140px] pointer-events-none"
    />

    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-32 md:py-44">
      <!-- Section header -->
      <div
        ref="headerRef"
        class="flex flex-col items-center text-center mb-20 md:mb-28"
      >
        <span
          class="text-xs font-medium tracking-[0.25em] uppercase text-zinc-500 mb-6"
        >
          Personil
        </span>
        <h2
          class="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold leading-tight tracking-tight text-white max-w-4xl"
        >
          Berkenalan Lebih Dekat dengan Personil Band Apostrophe
        </h2>
      </div>

      <!-- Members list -->
      <div class="flex flex-col gap-24 md:gap-36">
        <div
          v-for="(member, idx) in members"
          :key="member.nickname"
          class="member-block grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        >
          <div
            class="aspect-4/5 overflow-hidden rounded-lg"
            :class="{ 'md:order-2': idx % 2 !== 0 }"
          >
            <img
              :src="member.image"
              :alt="member.fullname"
              loading="eager"
              class="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.03]"
            />
          </div>

          <div
            class="flex flex-col gap-2 md:gap-3"
            :class="idx % 2 !== 0 ? 'md:text-right md:items-end' : ''"
          >
            <span
              class="text-xs font-medium tracking-[0.25em] uppercase text-zinc-500"
            >
              {{ member.role }}
            </span>
            <h3
              class="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight"
            >
              {{ member.fullname }}
            </h3>
            <span class="text-base font-medium text-zinc-300">
              "{{ member.nickname }}"
            </span>
            <p
              class="text-base md:text-lg leading-relaxed text-zinc-400 max-w-lg mt-1"
            >
              {{ member.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
