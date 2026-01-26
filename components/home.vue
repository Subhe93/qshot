<script setup>
useHead({
  title: "Qshot: bio & qr creator",
  titleTemplate: "Qshot: bio & qr creator",
  link: [
    {
      rel: "stylesheet",
      href: `https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400&display=swap`,
    },
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
  ],
  style: [
    {
      children: `
            * {
              font-family: 'Inter', sans-serif !important;
            }
          `,
      type: "text/css",
    },
  ],
});

useSeoMeta({
  title: () => "Qshot: bio & qr creator",
  description: () => "Enjoy 12 months of premium access for free!",
  author: "Qshot",
  ogType: "website",
  ogTitle: "Qshot: bio & qr creator",
  ogDescription: () => "Enjoy 12 months of premium access for free!",
  //   ogUrl: () => url.origin,
  ogLocale: () => "en",
  twitterTitle: "Qshot: bio & qr creator",
  twitterDescription: () => "Enjoy 12 months of premium access for free!",
  twitterCard: "summary_large_image",
  twitterSite: "Qshot: bio & qr creator",
  twitterCreator: "Enjoy 12 months of premium access for free!",
  twitterImage: "/logo.svg",
});

defineOgImage({
  url: "/logo.svg",
  width: 1200,
  height: 630,
  alt: "Qshot: bio & qr creator",
});
</script>

<template>
  <section
    class="home-cont relative bg-cover min-h-screen bg-fixed bg-center hero-bg overflow-hidden w-full max-w-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-3xl rounded-xl shadow-md"
    style="background: black"
  >
    <!-- grid -->
    <!-- <div
      class="pointer-events-none absolute inset-0 bg-center bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"
    /> -->

    <div class="relative mx-auto flex max-w-7xl flex-col justify-center gap-4">
      <!-- spotlight -->
      <div
        class="absolute -top-8 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/25 blur-[120px] lg:-top-8 lg:size-[32rem] lg:blur-[200px]"
      />
      <!-- <ClientOnly> -->
      <div class="relative w-full">
        <div class="grid place-items-center">
          <NuxtImg loading="lazy" class="Home-logo" src="/logo.svg"></NuxtImg>

          <h1 class="name_text text-5xl pr-4 pl-4 pt-2 text-center">
            Bio & QR creator
          </h1>
          <h3 class="bio_text text-xl text-center pr-4 pl-4 pt-5">
            Enjoy 12 months of premium access for free!
          </h3>
        </div>
        <br />
        <div class="flex social-btns">
          <a
            class="app-btn blu flex vert"
            href="https://apps.apple.com/eg/app/qshot-bio-qr-creator/id6587578534"
          >
            <img src="/apple.svg" />
            <p>
              <!-- Available on the <br /> -->
              <span class="big-txt">App Store</span>
            </p>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=linkinbio.qshot.com"
            class="app-btn blu flex vert"
          >
            <img src="/google-play.svg" />
            <p>
              <!-- Coming soon <br /> -->
              <span class="big-txt">Google Play</span>
            </p>
          </a>
        </div>
        <!-- <div class="flex social-btns">
            <a class="app-btn blu flex vert" href="/qshot.apk">
              <img src="/android.svg" class="pa-1" />
              <p>
                Get Apk <br />
                <span class="big-txt">Direct Download</span>
              </p>
            </a>
          </div> -->
      </div>
      <!-- </ClientOnly> -->
    </div>
    <img class="pa-home" src="/SVG/Asset_2.svg" />
  </section>
</template>
<style scoped>
.bio_text {
  opacity: 0.8;
  color: white;
}
.name_text {
  font-size: 29px;
}
@media (max-width: 991px) {
  .name_text {
    /* font-size: calc(30px - 20%); */
    /* font-size: calc(4vw + 5px); */
    font-size: 29px;
    margin-top: 5px;
  }
  .bio_text {
    font-size: 16px;

    /* font-size: calc(20px - 20%); */
  }
}
</style>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app {
  &-btn {
    width: 45%;
    max-width: 190px;
    color: #fff;
    margin: 10px 10px;
    padding: 8px 15px;
    text-align: left;
    border-radius: 5px;
    text-decoration: none;
    font-family: "Lucida Grande", sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    &.blu {
      background-color: #101010;
      transition: background-color 0.25s linear;
      &:hover {
        background-color: #454545;
      }
    }
    img {
      width: 20%;
      text-align: center;
      font-size: 28px;
      margin-right: 7px;
      color: white;
    }
    .big-txt {
      font-size: 17px;
      text-transform: capitalize;
      white-space: nowrap;
    }
  }
}
</style>
