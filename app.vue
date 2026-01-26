<script lang="ts" setup>
// import { SpeedInsights } from "@vercel/speed-insights/nuxt";
const { appName, email } = useAppConfig();
const toast = useToast();
// const { t } = useI18n();
const url = useRequestURL();

// Helper function to extract subdomain
function getSubdomain() {
  const host = url;
  // const parts = host.split(".");
  // if (host !== "qshot.com") {
  // console.log(host);
  if (host.hostname !== "qshot.com") {
    // if (host.hostname !== "localhost") {
    return host.hostname;
  } else {
    if (host.pathname === "/privacy" || host.pathname === "/terms") {
      return host;
    } else {
      return "";
    }
  }
}
const subdomainName = getSubdomain();

useHead({
  titleTemplate: `%s - ${appName}`,
  link: [
    // {
    //   rel: "icon",
    //   type: "image/x-icon",
    //   href: "/favicon.ico",
    // },
    // {
    //   rel: "apple-touch-icon",
    //   sizes: "180x180",
    //   href: "/apple-touch-icon.png",
    // },
    // {
    //   rel: "icon",
    //   type: "image/png",
    //   sizes: "32x32",
    //   href: "/favicon-32x32.png",
    // },
    // {
    //   rel: "icon",
    //   type: "image/png",
    //   sizes: "16x16",
    //   href: "/favicon-16x16.png",
    // },
  ],
  script: [
    // {
    //   src: "https://plausible.hrcd.fr/js/script.js",
    //   defer: true,
    //   "data-domain": "canvas.hrcd.fr",
    // },
  ],
});

if (process.client) {
}

// defineShortcuts({
//   meta_o: {
//     usingInput: true,
//     handler: () => {
//       copyToClipboard(email);
//       toast.add({
//         title: t("global.email_copied"),
//         icon: "i-heroicons-check-circle",
//         timeout: 2500,
//       });
//     },
//   },
// });
</script>

<template>
  <Html
    lang="en"
    class="bg-zinc-950 text-main transition-colors duration-300 selection:bg-white/60 selection:text-zinc-800"
  >
    <Body>
      <NuxtLayout name="default">
        <!-- <NuxtLayout name="default" v-if="subdomainName"> -->
        <NuxtPage />
      </NuxtLayout>
      <!-- <NuxtLayout v-else name="home">
        <Home></Home>
      </NuxtLayout> -->
    </Body>
  </Html>
</template>
