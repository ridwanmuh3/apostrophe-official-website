<script setup lang="ts">
import members from "~/assets/data/members";

const { gsap } = useGsap();

const sectionRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (headerRef.value) {
      gsap.from(headerRef.value.children, {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.value,
          start: "top 84%",
          once: true,
        },
      });
    }

    sectionRef.value?.querySelectorAll<HTMLElement>(".member-row").forEach((row) => {
      const media = row.querySelector(".member-media");
      const shot = row.querySelector(".member-shot");
      const info = row.querySelector(".member-info");

      if (media) {
        gsap.from(media, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });
      }

      if (shot) {
        gsap.from(shot, {
          scale: 1.08,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });
      }

      if (info) {
        gsap.from(info, {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 80%", once: true },
        });
      }
    });
  });
});

onBeforeUnmount(() => mm?.revert());
</script>

<template>
  <section
    id="members-section"
    ref="sectionRef"
    class="relative w-full overflow-hidden py-32 md:py-44"
  >
    <div class="mx-auto max-w-7xl px-6 md:px-10">
      <div ref="headerRef">
        <UiSectionLabel index="04" label="Personil" />

        <div class="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2
            class="max-w-3xl font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.95] tracking-[-0.025em]"
          >
            Berkenalan Lebih Dekat dengan Personil Band Apostrophe
          </h2>
          <p class="font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash">
            Lima orang · Satu suara
          </p>
        </div>
      </div>

      <div class="mt-20 flex flex-col gap-24 md:mt-28 md:gap-32">
        <article
          v-for="(member, idx) in members"
          :key="member.fullname"
          class="member-row group grid grid-cols-12 items-center gap-y-8 md:gap-x-10"
        >
          <div
            class="member-media col-span-12 md:col-span-5"
            :class="idx % 2 !== 0 ? 'md:order-2 md:col-start-8' : ''"
          >
            <div class="relative aspect-4/5 overflow-hidden rounded-editorial bg-bone/5">
              <img
                :src="member.image"
                :alt="`${member.fullname} — ${member.role}`"
                width="864"
                height="864"
                loading="lazy"
                decoding="async"
                class="member-shot h-full w-full object-cover object-center"
              >
            </div>
          </div>

          <div
            class="member-info col-span-12 md:col-span-6"
            :class="
              idx % 2 !== 0
                ? 'md:order-1 md:col-start-1 md:text-right'
                : 'md:col-start-7'
            "
          >
            <div
              class="flex items-baseline gap-4"
              :class="idx % 2 !== 0 ? 'md:flex-row-reverse' : ''"
            >
              <span class="font-oxanium text-[11px] tracking-[0.24em] text-champagne">
                {{ String(idx + 1).padStart(2, "0") }}
              </span>
              <span class="h-px flex-1 bg-bone/12" />
              <span class="font-oxanium text-[9px] uppercase tracking-[0.26em] text-ash">
                {{ member.role }}
              </span>
            </div>

            <h3
              class="mt-5 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[0.98] tracking-[-0.02em]"
            >
              {{ member.fullname }}
            </h3>

            <p
              class="mt-5 max-w-md text-[15px] leading-[1.8] text-ash"
              :class="idx % 2 !== 0 ? 'md:ml-auto' : ''"
            >
              {{ member.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.member-shot {
  filter: grayscale(1) sepia(0.16) saturate(0.9) contrast(1.04) brightness(0.92);
  transition:
    filter 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (hover: hover) and (pointer: fine) {
  .member-row:hover .member-shot {
    filter: none;
    transform: scale(1.03);
  }
}
</style>
