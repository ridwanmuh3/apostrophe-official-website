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
        { name: "theme-color", content: "#0a0a0b" },
      ],
      link: [
        { rel: "icon", type: "image/webp", href: "/logo/apostrophe.webp" },
        {
          rel: "preload",
          as: "image",
          href: "/images/hero-1600.webp",
          imagesrcset:
            "/images/hero-800.webp 800w, /images/hero-1200.webp 1200w, /images/hero-1600.webp 1600w, /images/hero-2400.webp 2400w",
          imagesizes: "100vw",
        },
      ],
    },
  },
  compatibilityDate: "2025-11-26",
  css: ["~/assets/css/tailwind.css"],
  devtools: { enabled: true },
  features: {
    inlineStyles: true,
  },
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
  icon: {
    clientBundle: {
      scan: true,
      icons: [
        "ic:baseline-whatsapp",
        "ic:baseline-tiktok",
        "mdi:play",
        "mdi:pause",
        "mdi:volume-high",
        "mdi:volume-off",
        "mdi:spotify",
        "mdi:instagram",
        "mdi:youtube",
        "mdi:arrow-left",
        "mdi:arrow-right",
      ],
    },
  },
  aiReady: false,
  skewProtection: false,
  fonts: {
    throwOnError: false,
    defaults: {
      preload: true,
    },
    families: [
      {
        name: "Instrument Serif",
        provider: "google",
        weights: [400],
        styles: ["normal", "italic"],
      },
      {
        name: "Inter Tight",
        provider: "google",
        weights: [300, 400, 500, 600],
        styles: ["normal"],
      },
    ],
  },
  robots: {
    blockNonSeoBots: true,
  },
  router: {
    options: {
      scrollBehaviorType: "auto",
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
