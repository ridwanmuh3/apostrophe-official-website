// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: "We are Apostrophe | Apostrophe Official Website",
      titleTemplate: "%s",
      htmlAttrs: {
        lang: "id",
      },
      meta: [
        {
          id: "description",
          name: "description",
          content:
            "Apostrophe - Band Musik yang membawakan genre Pop, Rock, dan Alternative Rock. Siap menemani acara maupun panggung Anda dengan semangat dan energi positif melalui musik kami.",
        },
      ],
      link: [
        { rel: "icon", type: "image/webp", href: "/logo/apostrophe.webp" },
      ],
    },
  },
  compatibilityDate: "2025-11-26",
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true },
  site: {
    name: "Apostrophe",
    url: "https://weareapostrophe.netlify.app",
    defaultLocale: "id",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/seo",
  ],
  aiReady: false,
  skewProtection: false,
  fonts: {
    throwOnError: false,
  },
  robots: {
    blockNonSeoBots: true,
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  ssr: true,
  ogImage: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
