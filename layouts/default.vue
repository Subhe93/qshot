<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    redirectToStore(): void {
      // Ensure this code runs on the client-side
      if (process.client) {
        const userAgent: string = navigator.userAgent;

        // Detect if the user is on an iPhone or Android device
        const isIOS: boolean = /iPhone|iPad|iPod/i.test(userAgent);
        const isAndroid: boolean = /Android/i.test(userAgent);

        if (isIOS) {
          window.location.href =
            "https://apps.apple.com/eg/app/qshot-bio-qr-creator/id6587578534";
          // window.location.href =
          //   "https://apps.apple.com/app/qshot-com/id6587578534";
        } else if (isAndroid) {
          window.location.href =
            "https://play.google.com/store/apps/details?id=linkinbio.qshot.com";
        } else {
          // Optional: Redirect to a default page or show an alert
          alert("This app is only available on iOS and Android devices.");
        }
      }
    },
  },
});
</script>

<template>
  <div class="relative">
    <ClientOnly>
    <LazyStickyBar />
    </ClientOnly>
    <div class="sm:pt-[50px] flex justify-center">
      <slot />
    </div>
    <footer
      class="w-full pt-5 pb-5 flex justify-center"
      style="font-size: 12px; font-weight: 200"
    >
      Powered By
      <ClientOnly>
        <NuxtImg
          loading="lazy"
          width="100%"
          class="ml-2 logo-footer mr-2 pointer"
          src="/logopng.png"
          @click="redirectToStore"
        />
      </ClientOnly>
      <NuxtLink to="/privacy"> Privacy policy </NuxtLink>
    </footer>
  </div>
</template>
