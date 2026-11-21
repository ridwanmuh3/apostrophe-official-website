import release from "~/assets/data/release";

export default function useAudioPlayer() {
  const audio = ref<HTMLAudioElement | null>(null);
  const playing = ref(false);
  const currentTime = ref(0);
  const duration = ref(release.duration);
  const volume = ref(0.8);
  const muted = ref(false);
  const error = ref("");
  const analyser = shallowRef<AnalyserNode | null>(null);
  let context: AudioContext | null = null;

  const sync = () => {
    if (!audio.value) return;
    currentTime.value = audio.value.currentTime;
    if (Number.isFinite(audio.value.duration)) duration.value = audio.value.duration;
    playing.value = !audio.value.paused;
  };

  onMounted(() => {
    if (!audio.value) return;
    try {
      const saved = localStorage.getItem("apostrophe-volume");
      if (saved !== null && Number.isFinite(Number(saved))) {
        volume.value = Math.max(0, Math.min(1, Number(saved)));
      }
    } catch { /* Private browsing may block storage. */ }
    audio.value.volume = volume.value;
    audio.value.addEventListener("timeupdate", sync);
    audio.value.addEventListener("durationchange", sync);
    audio.value.addEventListener("play", sync);
    audio.value.addEventListener("pause", sync);
    audio.value.addEventListener("ended", sync);
    audio.value.addEventListener("error", onError);
  });

  function onError() {
    error.value = "Audio gagal dimuat. Muat ulang halaman untuk mencoba lagi.";
    playing.value = false;
  }

  async function play() {
    if (!audio.value || error.value) return;
    try {
      if (!context && typeof window.AudioContext !== "undefined") {
        try {
          context = new AudioContext();
          const source = context.createMediaElementSource(audio.value);
          const node = context.createAnalyser();
          node.fftSize = 256;
          source.connect(node);
          node.connect(context.destination);
          analyser.value = node;
        } catch { /* Audio still plays without waveform analysis. */ }
      }
      if (context?.state === "suspended") await context.resume();
      await audio.value.play();
    } catch {
      error.value = "Audio tidak bisa diputar. Periksa koneksi lalu muat ulang halaman.";
    }
  }

  function toggle() {
    if (audio.value?.paused) void play();
    else audio.value?.pause();
  }

  function seek(time: number) {
    if (audio.value && Number.isFinite(time)) {
      audio.value.currentTime = Math.max(0, Math.min(time, duration.value));
      currentTime.value = audio.value.currentTime;
    }
  }

  function setVolume(value: number) {
    if (!audio.value) return;
    volume.value = Math.max(0, Math.min(1, value));
    audio.value.volume = volume.value;
    if (volume.value > 0) muted.value = audio.value.muted = false;
    try { localStorage.setItem("apostrophe-volume", String(volume.value)); }
    catch { /* Storage is optional. */ }
  }

  function toggleMute() {
    if (!audio.value) return;
    muted.value = audio.value.muted = !audio.value.muted;
  }

  onBeforeUnmount(() => {
    audio.value?.pause();
    if (context) void context.close();
  });

  return { audio, playing, currentTime, duration, volume, muted, error, analyser, toggle, seek, setVolume, toggleMute };
}
