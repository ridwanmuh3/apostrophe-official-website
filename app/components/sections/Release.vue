<script setup lang="ts">
import type { SplitText as SplitTextType } from "gsap/SplitText";
import release from "~/assets/data/release";

const { gsap, ScrollTrigger, SplitText } = useGsap();
const player = useAudioPlayer();
const audioEl = player.audio;
const {
  playing: isPlaying,
  currentTime,
  duration,
  volume,
  muted,
  error,
  analyser,
} = player;

const section = ref<HTMLElement | null>(null);
const record = ref<HTMLElement | null>(null);
const sleeve = ref<HTMLElement | null>(null);
const heading = ref<HTMLElement | null>(null);
const ghost = ref<HTMLElement | null>(null);
const controls = ref<HTMLElement | null>(null);

const volumeOpen = ref(false);
const sectionVisible = ref(true);
const reduced = ref(false);
const intensity = ref(0);

const streaming = Object.entries(release.streaming).filter(([, url]) => url);

let visibilityObserver: IntersectionObserver | null = null;
let motionQuery: MediaQueryList | null = null;
let motionContext: ReturnType<typeof gsap.context> | null = null;
let split: SplitTextType | null = null;
let vinylTween: ReturnType<typeof gsap.to> | null = null;
let ambientContext: ReturnType<typeof gsap.context> | null = null;

function syncMotion() {
  reduced.value = !!motionQuery?.matches;
}

onMounted(async () => {
  if (!section.value) return;

  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotion();
  motionQuery.addEventListener("change", syncMotion);

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      sectionVisible.value = !!entry?.isIntersecting;
    },
    { threshold: 0.08 },
  );
  visibilityObserver.observe(section.value);

  await document.fonts?.ready.catch(() => {});

  motionContext = gsap.context(() => {
    if (!section.value || !sleeve.value || !heading.value) return;

    if (!reduced.value) {
      split = SplitText.create(heading.value, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });

      const intro = gsap.timeline({ paused: true });

      intro
        .from(sleeve.value, {
          clipPath: "inset(0 100% 0 0)",
          scale: 1.05,
          duration: 1.1,
          ease: "power3.out",
        })
        .from(
          record.value,
          { x: -55, opacity: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7",
        )
        .from(
          split.lines,
          { yPercent: 112, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.6",
        )
        .from(
          controls.value,
          { y: 26, opacity: 0, duration: 0.7, ease: "power2.out" },
          "-=0.35",
        );

      ScrollTrigger.create({
        trigger: section.value,
        start: "top 70%",
        once: true,
        onEnter: () => intro.play(),
      });

      gsap.to(ghost.value, {
        x: 55,
        ease: "none",
        scrollTrigger: {
          trigger: section.value,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(sleeve.value, {
        y: -32,
        ease: "none",
        scrollTrigger: {
          trigger: section.value,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    vinylTween = gsap.to(record.value, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      paused: true,
    });
  }, section.value);

  ScrollTrigger.refresh();
});

watch([isPlaying, reduced], ([playing, reduce]) => {
  if (playing && !reduce) {
    vinylTween?.play();
    if (!ambientContext && section.value) {
      ambientContext = gsap.context(() => {
        gsap.to(".release-halo", {
          scale: 1.06,
          opacity: 0.55,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, section.value);
    }
  } else {
    vinylTween?.pause();
    ambientContext?.revert();
    ambientContext = null;
  }
});

function tilt(event: PointerEvent) {
  if (reduced.value || event.pointerType !== "mouse" || !sleeve.value) return;

  const bounds = sleeve.value.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;

  gsap.to(sleeve.value, {
    rotateX: y,
    rotateY: x,
    duration: 0.35,
    overwrite: true,
  });
  gsap.to(sleeve.value.querySelector(".cover-shine"), {
    opacity: Math.max(0, (x + 5) / 10) * 0.6,
    duration: 0.35,
  });
}

function untilt() {
  if (!sleeve.value || reduced.value) return;
  gsap.to(sleeve.value, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.5,
    overwrite: true,
  });
  gsap.to(sleeve.value.querySelector(".cover-shine"), {
    opacity: 0,
    duration: 0.4,
  });
}

function magnet(event: PointerEvent) {
  if (reduced.value || event.pointerType !== "mouse") return;
  const button = event.currentTarget as HTMLElement;
  const bounds = button.getBoundingClientRect();
  gsap.to(button, {
    x: (event.clientX - bounds.left - bounds.width / 2) * 0.12,
    y: (event.clientY - bounds.top - bounds.height / 2) * 0.12,
    duration: 0.2,
  });
}

function unmagnet(event: PointerEvent) {
  gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.3 });
}

function closeVolumeOnLeave(event: PointerEvent) {
  if (
    event.pointerType === "mouse" &&
    !(event.currentTarget as HTMLElement).contains(document.activeElement)
  ) {
    volumeOpen.value = false;
  }
}

function closeVolumeOnBlur(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    volumeOpen.value = false;
  }
}

function openVolumeOnHover(event: PointerEvent) {
  if (event.pointerType === "mouse") volumeOpen.value = true;
}

onBeforeUnmount(() => {
  visibilityObserver?.disconnect();
  motionQuery?.removeEventListener("change", syncMotion);
  ambientContext?.revert();
  motionContext?.revert();
  split?.revert();
});
</script>

<template>
  <section
    id="release-section"
    ref="section"
    class="relative isolate overflow-x-clip bg-ink py-28 text-bone md:py-40"
    aria-labelledby="release-title"
  >
    <audio ref="audioEl" :src="release.audio" preload="metadata" />

    <div
      ref="ghost"
      aria-hidden="true"
      class="pointer-events-none absolute -left-8 top-24 whitespace-nowrap font-display text-[clamp(5rem,16vw,15rem)] leading-none tracking-[-0.03em] text-bone/[0.035]"
    >
      BACK TO ME
    </div>

    <div class="relative mx-auto max-w-7xl px-6 md:px-10">
      <UiSectionLabel index="02" label="Musik" />

      <div class="mt-14 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-10 lg:gap-16">
        <!-- Sticky cover + vinyl -->
        <div class="md:col-span-6">
          <div class="lg:sticky lg:top-28">
            <div
              class="relative mx-auto w-full max-w-[440px] [perspective:1000px]"
              @pointermove="tilt"
              @pointerleave="untilt"
            >
              <div
                class="release-halo pointer-events-none absolute -inset-8 bg-violet/15 blur-[48px] lg:blur-[90px]"
                :style="{
                  opacity: isPlaying && !reduced ? 0.45 + intensity * 0.4 : 0.26,
                }"
              />
              <div
                ref="record"
                aria-hidden="true"
                class="absolute right-[-7%] top-[9%] aspect-square w-[83%] rounded-full border-[20px] border-[#121016] bg-[repeating-radial-gradient(circle,#131117_0px,#131117_2px,#242029_3px,#121016_5px)] shadow-[10px_18px_40px_rgba(0,0,0,.55)]"
              >
                <div
                  class="absolute inset-[34%] grid place-items-center rounded-full border border-violet/30 bg-[#2c2340]"
                >
                  <div class="h-2 w-2 rounded-full bg-bone/80" />
                </div>
              </div>
              <div ref="sleeve" class="relative w-[88%] transform-gpu">
                <MusicCoverArt />
              </div>
            </div>

            <div
              class="mt-8 flex items-center justify-between border-t border-bone/10 pt-4 font-oxanium text-[9px] uppercase tracking-[0.28em] text-ash"
            >
              <span>{{ release.status }}</span>
              <span aria-hidden="true">APR · 33⅓</span>
            </div>
          </div>
        </div>

        <!-- Copy + player -->
        <div class="md:col-span-6 lg:pt-6">
          <p class="font-oxanium text-[10px] uppercase tracking-[0.3em] text-violet/90">
            {{ release.status }}
          </p>

          <h2
            id="release-title"
            ref="heading"
            class="mt-5 font-display text-[clamp(3.4rem,8vw,6.5rem)] leading-[0.85] tracking-[-0.03em]"
          >
            {{ release.title }}
          </h2>

          <p class="mt-5 text-lg font-light text-bone/80">
            {{ release.artist }}
            <span class="ml-2 font-oxanium text-[9px] uppercase tracking-[0.26em] text-ash">
              {{ release.badge }}
            </span>
          </p>

          <p class="mt-7 max-w-[46ch] text-[15px] leading-[1.8] text-ash">
            {{ release.description }}
          </p>

          <div ref="controls" class="mt-10 max-w-lg">
            <MusicWaveform
              v-model:intensity="intensity"
              :analyser="analyser"
              :playing="isPlaying"
              :reduced="reduced"
            />

            <MusicSeekBar
              :current-time="currentTime"
              :duration="duration"
              :disabled="!!error"
              @seek="player.seek"
              @toggle="player.toggle"
            />

            <div class="mt-6 flex items-center gap-5">
              <button
                type="button"
                class="group relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-editorial border border-champagne/40 text-bone transition-colors duration-500 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                data-cursor="Play"
                :disabled="!!error"
                :aria-label="isPlaying ? 'Jeda Back to Me' : 'Putar Back to Me'"
                :aria-pressed="isPlaying"
                @pointermove="magnet"
                @pointerleave="unmagnet"
                @click="player.toggle"
              >
                <span
                  aria-hidden="true"
                  class="absolute inset-0 translate-y-full bg-bone transition-transform duration-500 ease-editorial group-hover:translate-y-0"
                />
                <Icon
                  :name="isPlaying ? 'mdi:pause' : 'mdi:play'"
                  class="relative z-10 text-2xl"
                />
              </button>

              <span class="font-oxanium text-[9px] uppercase tracking-[0.26em] text-ash">
                {{ isPlaying ? "Sedang diputar" : "Putar rekaman" }}
              </span>

              <div
                class="relative ml-auto flex items-center gap-2"
                @pointerenter="openVolumeOnHover"
                @pointerleave="closeVolumeOnLeave"
                @focusout="closeVolumeOnBlur"
              >
                <button
                  type="button"
                  :disabled="!!error"
                  class="grid h-9 w-9 place-items-center rounded-editorial text-ash transition-colors hover:text-bone disabled:opacity-40"
                  :aria-label="muted ? 'Nyalakan suara' : 'Bisukan suara'"
                  :aria-pressed="muted"
                  @click="player.toggleMute"
                >
                  <Icon
                    :name="muted || volume === 0 ? 'mdi:volume-off' : 'mdi:volume-high'"
                    class="text-xl"
                  />
                </button>
                <button
                  type="button"
                  :disabled="!!error"
                  class="font-oxanium text-[9px] uppercase tracking-[0.24em] text-ash underline underline-offset-4 transition-colors hover:text-bone disabled:opacity-40"
                  :aria-expanded="volumeOpen"
                  aria-controls="release-volume"
                  @click="volumeOpen = !volumeOpen"
                >
                  Volume
                </button>
                <input
                  v-show="volumeOpen"
                  id="release-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="volume"
                  :disabled="!!error"
                  class="absolute bottom-0 right-0 w-28 translate-y-full accent-champagne sm:static sm:translate-y-0"
                  aria-label="Volume Back to Me"
                  @input="player.setVolume(Number(($event.target as HTMLInputElement).value))"
                >
              </div>
            </div>

            <p v-if="error" class="mt-4 text-sm text-rose-200" role="alert">
              {{ error }}
            </p>

            <div v-if="streaming.length" class="mt-8 flex flex-wrap gap-5">
              <a
                v-for="[platform, url] in streaming"
                :key="platform"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                class="font-oxanium text-[9px] uppercase tracking-[0.24em] text-violet underline underline-offset-4"
              >
                Dengarkan di {{ platform }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <MusicStickyPlayer
    :visible="isPlaying && !sectionVisible"
    :playing="isPlaying"
    :current-time="currentTime"
    :duration="duration"
    @toggle="player.toggle"
    @seek="player.seek"
  />
</template>
