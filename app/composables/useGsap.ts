import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import type { Flip as FlipType } from "gsap/Flip";
import type { ScrollToPlugin as ScrollToPluginType } from "gsap/ScrollToPlugin";

export default function () {
  const nuxtApp = useNuxtApp();

  return {
    gsap: nuxtApp.$gsap as typeof GsapType,
    ScrollTrigger: nuxtApp.$ScrollTrigger as typeof ScrollTriggerType,
    SplitText: nuxtApp.$SplitText as typeof SplitTextType,
    Flip: nuxtApp.$Flip as typeof FlipType,
    ScrollToPlugin: nuxtApp.$ScrollToPlugin as typeof ScrollToPluginType,
  };
}
