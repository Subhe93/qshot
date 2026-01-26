// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      viewport: "width=device-width, initial-scale=1",
      charset: "utf-8",
      meta: [
        {
          name: "author",
          content: "iwings",
        },
      ],
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  css: ["~/assets/style/main.scss", "@/assets/css/tailwind.css"],

  devtools: { enabled: false },
  modules: [
    "nuxt-swiper",
    "@nuxt/ui",
    "nuxt-svgo",
    "@nuxt/image",
    "nuxt-og-image",
    "nuxt-easy-lightbox",
  ],
  buildModules: ["@nuxtjs/tailwindcss"],
  image: {
    format: ["webp"],
    screens: {
      avatar: 96,
      cover: 256,
      project: 1536,
    },
  },
  svgo: {
    autoImportPath: "./assets/logo/",
  },
  plugins: ["~/plugins/imageblur.client.js"],

  compatibilityDate: "2024-10-28",
});
