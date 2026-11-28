import type Lenis from "lenis";

/**
 * Lenis + ScrollTrigger wiring.
 *
 * Only the layout calls `useSmoothScroll()`; every other component uses the
 * exported `lockScroll` / `unlockScroll` / `scrollToSection` helpers so a
 * single Lenis instance is ever created.
 */
let instance: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;
let anchorHandler: ((event: MouseEvent) => void) | null = null;
let refreshHandler: (() => void) | null = null;

export function lockScroll() {
  instance?.stop();
  if (import.meta.client) document.body.classList.add("is-locked");
}

export function unlockScroll() {
  if (import.meta.client) document.body.classList.remove("is-locked");
  instance?.start();
}

export function scrollToSection(target: string | HTMLElement, offset = -84) {
  if (!import.meta.client) return;

  const element =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;

  if (instance) {
    instance.scrollTo(element, { offset, duration: 1.2 });
  } else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}

export default function useSmoothScroll() {
  const { gsap, ScrollTrigger } = useGsap();

  onMounted(async () => {
    if (instance) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches) {
      const { default: LenisCtor } = await import("lenis");

      const lenis = new LenisCtor({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.35,
        wheelMultiplier: 1,
      });

      instance = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    // In-page anchors: Lenis when available, instant native jump otherwise.
    anchorHandler = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor || anchor.hasAttribute("data-no-autoscroll")) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const element = document.querySelector(hash);
      if (!element) return;

      event.preventDefault();
      scrollToSection(element as HTMLElement);

      if (window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
    };
    document.addEventListener("click", anchorHandler, true);

    refreshHandler = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshHandler);
    document.fonts?.ready.then(refreshHandler).catch(() => {});
  });

  onBeforeUnmount(() => {
    if (anchorHandler) document.removeEventListener("click", anchorHandler, true);
    if (refreshHandler) window.removeEventListener("load", refreshHandler);
    if (tickerFn) gsap.ticker.remove(tickerFn);

    instance?.destroy();
    instance = null;
    tickerFn = null;
    anchorHandler = null;
    refreshHandler = null;

    unlockScroll();
  });

  return { lockScroll, unlockScroll, scrollToSection };
}
