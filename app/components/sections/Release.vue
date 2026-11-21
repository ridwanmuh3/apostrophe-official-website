<script setup lang="ts">
import { SplitText } from "gsap/SplitText";
import release from "~/assets/data/release";

const { gsap, ScrollTrigger } = useGsap();
const player = useAudioPlayer();
const audioEl = player.audio;
const { playing: isPlaying, currentTime, duration, volume, muted, error, analyser } = player;
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
let split: SplitText | null = null;
let vinylTween: ReturnType<typeof gsap.to> | null = null;
let ambientContext: ReturnType<typeof gsap.context> | null = null;

function syncMotion() { reduced.value = !!motionQuery?.matches; }

onMounted(() => {
  if (!section.value) return;
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotion();
  motionQuery.addEventListener("change", syncMotion);
  visibilityObserver = new IntersectionObserver(([entry]) => { sectionVisible.value = !!entry?.isIntersecting; }, { threshold: 0.08 });
  visibilityObserver.observe(section.value);

  motionContext = gsap.context(() => {
    if (!section.value || !sleeve.value || !heading.value) return;
    if (!reduced.value) {
      split = SplitText.create(heading.value, { type: "chars", aria: "auto" });
      const intro = gsap.timeline({ paused: true });
      intro.from(sleeve.value, { clipPath: "inset(0 100% 0 0)", scale: 1.06, duration: 1.1, ease: "power3.out" })
        .from(record.value, { x: -65, opacity: 0, duration: 0.9, ease: "power2.out" }, "-=0.65")
        .from(split.chars, { yPercent: 105, opacity: 0, duration: 0.65, stagger: 0.035, ease: "power3.out" }, "-=0.55")
        .from(controls.value, { y: 28, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.25");
      ScrollTrigger.create({ trigger: section.value, start: "top 70%", once: true, onEnter: () => intro.play() });
      gsap.to(ghost.value, { x: 65, ease: "none", scrollTrigger: { trigger: section.value, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(sleeve.value, { y: -40, ease: "none", scrollTrigger: { trigger: section.value, start: "top bottom", end: "bottom top", scrub: true } });
    }
    vinylTween = gsap.to(record.value, { rotate: 360, duration: 20, repeat: -1, ease: "none", paused: true });
  }, section.value);
});

watch([isPlaying, reduced], ([playing, reduce]) => {
  if (playing && !reduce) {
    vinylTween?.play();
    if (!ambientContext && section.value) ambientContext = gsap.context(() => {
      gsap.to(".release-mesh", { x: 35, y: -26, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".release-grain", { opacity: 0.22, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(sleeve.value, { y: -9, duration: 3.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".release-halo", { scale: 1.09, opacity: 0.6, duration: 2.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, section.value);
  } else {
    vinylTween?.pause();
    ambientContext?.revert();
    ambientContext = null;
  }
});

function tilt(event: PointerEvent) {
  if (reduced.value || event.pointerType !== "mouse" || !sleeve.value) return;
  const bounds = sleeve.value.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -12;
  gsap.to(sleeve.value, { rotateX: y, rotateY: x, duration: 0.35, overwrite: true });
  gsap.to(sleeve.value.querySelector(".cover-shine"), { opacity: Math.max(0, (x + 6) / 12) * 0.7, duration: 0.35 });
}

function untilt() {
  if (!sleeve.value || reduced.value) return;
  gsap.to(sleeve.value, { rotateX: 0, rotateY: 0, duration: 0.5, overwrite: true });
  gsap.to(sleeve.value.querySelector(".cover-shine"), { opacity: 0, duration: 0.4 });
}

function magnet(event: PointerEvent) {
  if (reduced.value || event.pointerType !== "mouse") return;
  const button = event.currentTarget as HTMLElement;
  const bounds = button.getBoundingClientRect();
  gsap.to(button, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.14, y: (event.clientY - bounds.top - bounds.height / 2) * 0.14, duration: 0.2 });
}

function unmagnet(event: PointerEvent) { gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.3 }); }

function closeVolumeOnLeave(event: PointerEvent) {
  if (event.pointerType === "mouse" && !(event.currentTarget as HTMLElement).contains(document.activeElement)) volumeOpen.value = false;
}

function closeVolumeOnBlur(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) volumeOpen.value = false;
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
  <section id="release-section" ref="section" class="relative isolate overflow-hidden bg-[#0e0c16] py-28 text-white md:py-36" aria-labelledby="release-title">
    <audio ref="audioEl" :src="release.audio" preload="metadata" />
    <div class="release-mesh pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-violet-700/15 blur-[110px]" />
    <div class="release-mesh pointer-events-none absolute -right-36 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blue-800/15 blur-[120px]" />
    <div class="release-grain pointer-events-none absolute inset-0 opacity-10 bg-[url('/images/hero.webp')] bg-cover bg-center mix-blend-overlay" />
    <div ref="ghost" aria-hidden="true" class="pointer-events-none absolute -left-12 top-16 whitespace-nowrap text-[clamp(5rem,18vw,16rem)] font-bold leading-none tracking-[-.04em] text-white/[.035]">BACK TO ME</div>

    <div class="relative mx-auto grid max-w-7xl items-center gap-20 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-16 md:px-10 lg:gap-28">
      <div class="relative mx-auto w-full max-w-[480px] [perspective:1000px]" @pointermove="tilt" @pointerleave="untilt">
        <div class="release-halo pointer-events-none absolute -inset-5 bg-violet-600/20 blur-3xl" :style="{ opacity: isPlaying && !reduced ? 0.4 + intensity * 0.65 : 0.3 }" />
        <div ref="record" aria-hidden="true" class="absolute right-[-7%] top-[9%] aspect-square w-[83%] rounded-full border-[22px] border-[#131219] bg-[repeating-radial-gradient(circle,#15141a_0px,#15141a_2px,#27242e_3px,#131219_5px)] shadow-[12px_20px_40px_rgba(0,0,0,.5)]">
          <div class="absolute inset-[34%] grid place-items-center rounded-full border border-white/20 bg-[#392e50]"><div class="h-2 w-2 rounded-full bg-zinc-300" /></div>
        </div>
        <div ref="sleeve" class="relative w-[88%] transform-gpu"><MusicCoverArt /></div>
      </div>

      <div class="relative max-w-xl">
        <p class="mb-6 text-sm font-medium tracking-[0.13em] text-violet-200">{{ release.status }}</p>
        <h2 id="release-title" ref="heading" class="text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[.94] tracking-[-.035em]">{{ release.title }}</h2>
        <p class="mt-5 text-xl text-zinc-200">{{ release.artist }} <span class="ml-2 text-sm text-zinc-300">{{ release.badge }}</span></p>
        <p class="mt-8 max-w-[52ch] text-base leading-relaxed text-zinc-300">{{ release.description }}</p>

        <div ref="controls" class="mt-10 max-w-lg">
          <MusicWaveform v-model:intensity="intensity" :analyser="analyser" :playing="isPlaying" :reduced="reduced" />
          <MusicSeekBar :current-time="currentTime" :duration="duration" :disabled="!!error" @seek="player.seek" @toggle="player.toggle" />
          <div class="mt-5 flex items-center gap-5">
            <button type="button" class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-200 text-zinc-950 shadow-[4px_10px_28px_rgba(100,70,160,.35)] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-40" :disabled="!!error" :aria-label="isPlaying ? 'Jeda Back to Me' : 'Putar Back to Me'" :aria-pressed="isPlaying" @pointermove="magnet" @pointerleave="unmagnet" @click="player.toggle">
              <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="text-3xl" />
            </button>
            <span class="text-sm font-medium text-zinc-200">{{ isPlaying ? 'Sedang diputar' : 'Putar rekaman' }}</span>
            <div class="relative ml-auto flex items-center gap-2" @pointerenter="openVolumeOnHover" @pointerleave="closeVolumeOnLeave" @focusout="closeVolumeOnBlur">
              <button type="button" :disabled="!!error" class="grid h-10 w-10 place-items-center rounded-full text-zinc-200 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-300 disabled:opacity-40" :aria-label="muted ? 'Nyalakan suara' : 'Bisukan suara'" :aria-pressed="muted" @click="player.toggleMute"><Icon :name="muted || volume === 0 ? 'mdi:volume-off' : 'mdi:volume-high'" class="text-2xl" /></button>
              <button type="button" :disabled="!!error" class="text-xs text-zinc-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-violet-300 disabled:opacity-40" :aria-expanded="volumeOpen" aria-controls="release-volume" @click="volumeOpen = !volumeOpen">Volume</button>
              <input v-show="volumeOpen" id="release-volume" type="range" min="0" max="1" step="0.01" :value="volume" :disabled="!!error" class="absolute bottom-0 right-0 w-28 translate-y-full accent-violet-300 focus-visible:outline-2 focus-visible:outline-violet-300 sm:static sm:translate-y-0" aria-label="Volume Back to Me" @input="player.setVolume(Number(($event.target as HTMLInputElement).value))" >
            </div>
          </div>
          <p v-if="error" class="mt-4 text-sm text-rose-200" role="alert">{{ error }}</p>
          <div v-if="streaming.length" class="mt-8 flex flex-wrap gap-4"><a v-for="[platform, url] in streaming" :key="platform" :href="url" target="_blank" rel="noopener noreferrer" class="text-sm text-violet-200 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-violet-300">Dengarkan di {{ platform }}</a></div>
        </div>
      </div>
    </div>
  </section>
  <MusicStickyPlayer :visible="isPlaying && !sectionVisible" :playing="isPlaying" :current-time="currentTime" :duration="duration" @toggle="player.toggle" @seek="player.seek" />
</template>
