// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: "We are Apostrophe | Apostrophe Official Website",
      htmlAttrs: {
        lang: "id",
      },
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
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
  css: ["./app/assets/css/tailwind.css"],
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/seo",
    "motion-v/nuxt",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Domine: {
            wght: "400..700",
          },
        },
      },
    ],
  ],
  nitro: { preset: "bun" },
  robots: {
    blockNonSeoBots: true,
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  ssr: false,
  ogImage: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
