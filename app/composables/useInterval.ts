export default (cb: () => void, ms: number) => {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const start = () => {
    stop();
    if (import.meta.client) {
      intervalId = setInterval(cb, ms);
    }
  };

  onMounted(start);
  onUnmounted(stop);

  return {
    start,
    stop,
  };
};
