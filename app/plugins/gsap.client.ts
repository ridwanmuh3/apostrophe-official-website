import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrollToPlugin);

  return {
    provide: {
      gsap,
      ScrollTrigger,
      SplitText,
      Flip,
      ScrollToPlugin,
    },
  };
});
