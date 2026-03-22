import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export default function () {
  const nuxtApp = useNuxtApp();

  return {
    gsap: nuxtApp.$gsap as typeof GsapType,
    ScrollTrigger: nuxtApp.$ScrollTrigger as typeof ScrollTriggerType,
  };
}
