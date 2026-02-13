<script setup>
const url = useRequestURL();
const { ImageServer } = useAppConfig();
import { useNuxtApp } from "#app";
import { sendRedirect } from "h3";
import HomeHeroStyle1 from "~/components/home/Hero/Style1.vue";
import HomeHeroStyle2 from "~/components/home/Hero/Style2.vue";
import HomeHeaderStyle1 from "~/components/home/Header/Style1.vue";
import HomeHeaderStyle2 from "~/components/home/Header/Style2.vue";

const nuxtApp = useNuxtApp();
// Helper function to extract subdomain
function getSubdomain() {
  const host = url.hostname;
  //   const parts = host.split(".");
  //   if (host.includes("qshot.com")) {
  //     return parts[0];
  //   } else {
  //     return host;
  //   }
  if (host === "qshot.com") {
    return "qshot.qshot.com";
  } else {
    return getUpdatedUrl();
    // معالجة مؤقتة: تحويل quazax.com إلى qshot.com
    if (host.includes("quazax.com")) {
      return host.replace("quazax.com", "speaknet.app");
    }
    return host;
  }
}
function getUpdatedUrl() {
  const host = url.hostname;
  const port = url.port;
  const path = url.pathname;
  if (host.includes("localhost")) {
    const subdomain = host.split(".")[0];
    console.log(`${subdomain}.speaknet.app${path.slice(0, -1)}`);
    return `${subdomain}.speaknet.app${path.slice(0, -1)}`;
  }
}

const data = ref(null);
const imageServer = ImageServer;
const subdomainName = getSubdomain();
console.log(subdomainName);
const textColor = ref(null); // Default text color
const bgColor = ref(null); // Default background color

if (subdomainName) {
  // Construct the URL with query parameters
  const params = new URLSearchParams({ name: subdomainName });
  const url = `https://api.speaknet.app/q-profile/user/test?${params.toString()}`;

  // Perform the fetch request
  const { data: fetchedData } = await useFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });

  if (!fetchedData.value) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found",
    });
  }
  console.log(fetchedData.value);
  // Ensure the global accountInfo state is updated on every navigation.
  const accountInfo = useState("accountInfo");
  accountInfo.value = fetchedData.value;

  if (fetchedData.value.data.type === "redirect") {
    const event = nuxtApp.ssrContext?.event;
    if (event) {
      console.log(fetchedData.value.data.user_template_profile);
      await sendRedirect(
        event,
        fetchedData.value.data.user_template_profile,
        301
      );
    }
  }
  data.value = fetchedData.value;
  //if settings not set
  if (!data.value.data.user_template_profile.settings) {
    console.log("old Profile");
    data.value.data.user_template_profile.settings =
      data.value.data.user_template_profile.info.settings;
  }
  //if background is null, initialize it
  if (!data.value.data.user_template_profile.settings.background) {
    data.value.data.user_template_profile.settings.background = {};
  }
  //if image or color
  if (!data.value.data.user_template_profile.settings.background?.image) {
    if (
      !fetchedData.value.data.user_template_profile.settings.background
        ?.color_value
    ) {
      //set bg black by defulte
      data.value.data.user_template_profile.settings.background.color_value = {
        color: "000000",
        type: "solid",
      };
    } else {
      //if gradieant or solid
      if (
        fetchedData.value.data.user_template_profile.settings.background
          .color_value.type === "gradient"
      ) {
        //gradieant
        bgColor.value =
          fetchedData.value.data.user_template_profile.settings.background.color_value;
      } else {
        //solid
        bgColor.value =
          fetchedData.value.data.user_template_profile.settings.background.color_value.color;
      }
    }
  }
  textColor.value =
    fetchedData.value.data.user_template_profile.settings.font_color || 16777215; // default white if null
} else {
  console.error("Subdomain not found in the URL");
}

// Computed properties لتسهيل الوصول للبيانات (يجب تعريفها قبل الدوال التي تستخدمها)
const profile = computed(() => data.value?.data?.user_template_profile || null);
const settings = computed(() => profile.value?.settings || {});
const profilePicture = computed(() => settings.value?.profile_picture);
const nameSettings = computed(() => settings.value?.name);
const bioSettings = computed(() => settings.value?.bio);
const backgroundSettings = computed(() => settings.value?.background);
const headerSettings = computed(() => settings.value?.header);
const pagesList = computed(() => data.value?.data?.pages_list || []);

// Hero style: style1 (default) | style2 — component chosen per settings.style (SSR-safe)
const heroStyle = computed(() => settings.value?.style || "style1");
const heroComponents = {
  style1: HomeHeroStyle1,
  style2: HomeHeroStyle2,
};
const heroComponent = computed(
  () => heroComponents[heroStyle.value] || HomeHeroStyle1
);
const heroProps = computed(() => ({
  profile: profile.value,
  settings: settings.value,
  imageServer,
  textColor: textColor.value,
}));

// Header per style (SSR-safe)
const headerComponents = {
  style1: HomeHeaderStyle1,
  style2: HomeHeaderStyle2,
};
const headerComponent = computed(
  () => headerComponents[heroStyle.value] || HomeHeaderStyle1
);
const headerProps = computed(() => ({
  pages_list: pagesList.value,
}));

//load font
const fontName = computed(() => settings.value?.font_family || 'Inter');
const userName = computed(() => nameSettings.value?.text || profile.value?.name || '');
// bio is now an object with text and hide properties
const userBio = computed(() => {
  const bio = bioSettings.value;
  if (typeof bio === 'string') return bio;
  return bio?.text || '';
});
const profileImage = computed(() => profilePicture.value?.image_url || settings.value?.logo?.image_url || '/logo-only.svg');
const profileImageUrl = computed(() => {
  if (!profileImage.value || profileImage.value === '/logo-only.svg') {
    return profileImage.value || '/logo-only.svg';
  }
  return imageServer + profileImage.value;
});
// لون النص الافتراضي من settings.font_color (للتوريث على كل النص داخل الصفحة)
const pageFontColorRgb = computed(() =>
  textColor.value != null ? numberToHexText(textColor.value) : 'rgb(255, 255, 255)'
);

// Computed properties للـ useHead
const fontUrl = computed(() => `https://fonts.googleapis.com/css2?family=${fontName.value}:wght@100;200;300;400&display=swap`);
const fontStyle = computed(() => `
  * {
    font-family: '${fontName.value}', sans-serif !important;
  }
`);
const pageTitle = computed(() => userName.value + " | Qshot");
const jsonLd = computed(() => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: userName.value,
  description: userBio.value,
  ...(profileImage.value && profileImage.value !== '/logo-only.svg' ? { image: profileImageUrl.value } : {}),
  url: url.origin,
}));

function numberToHex(num) {
  if (!backgroundSettings.value?.image) {
    if (backgroundSettings.value?.color_value?.type === "gradient") {
      return generateBackgroundColor(num);
    } else {
      // Extracting red, green, and blue components
      var red = (num >> 16) & 0xff;
      var green = (num >> 8) & 0xff;
      var blue = num & 0xff;

      // Returning the RGB components as a string
      return `rgb(${red}, ${green}, ${blue})`;
    }
  }
}
function numberToHexText(num) {
  // Extracting red, green, and blue components
  var red = (num >> 16) & 0xff;
  var green = (num >> 8) & 0xff;
  var blue = num & 0xff;

  // Returning the RGB components as a string
  return `rgb(${red}, ${green}, ${blue})`;
}

function generateBackgroundColor(colorValue) {
  if (typeof colorValue === "object") {
    const { colors, gradient, stops } = colorValue;
    const colorStops = colors
      .map((color, index) => {
        const stop =
          stops[index] !== undefined
            ? stops[index] * 100
            : index * (100 / (colors.length - 1));
        return `#${color.toString(16).slice(2)} ${stop}%`;
      })
      .join(", ");

    switch (gradient) {
      case "LinearGradient":
        return `linear-gradient(90deg, ${colorStops})`;
      case "RadialGradient":
        return `radial-gradient(circle, ${colorStops})`;
      case "SweepGradient":
        return `conic-gradient(${colorStops})`;
      default:
        return "transparent";
    }
  } else {
    return colorValue;
  }
}

function updateStyles(bgColor, textColor) {
  // لون النص يُطبَّق عبر متغير CSS --page-font-color على الـ section (لا نعتمد على querySelectorAll لتفادي مشكلة توقيت ClientOnly)
  if (!backgroundSettings.value?.image) {
    document.body.style.background = bgColor;
  }
  // placeholders للحقول
  let placeholderStyle = document.getElementById("dynamic-placeholder-style");
  if (!placeholderStyle) {
    placeholderStyle = document.createElement("style");
    placeholderStyle.id = "dynamic-placeholder-style";
    document.head.appendChild(placeholderStyle);
  }
  placeholderStyle.textContent = `
    input::placeholder,
    textarea::placeholder {
      color: ${textColor} !important;
      opacity: 0.5 !important;
    }
  `;
}

onMounted(() => {
  //update style bg - text
  if (bgColor.value && textColor.value) {
    updateStyles(numberToHex(bgColor.value), numberToHexText(textColor.value));
  }
});

useHead({
  title: pageTitle,
  titleTemplate: pageTitle,
  link: [
    {
      rel: "stylesheet",
      href: fontUrl,
    },
    ...(profileImage.value && profileImage.value !== '/logo-only.svg' ? [
      {
        rel: "icon",
        type: "image/png",
        href: profileImageUrl.value,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: profileImageUrl.value,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: profileImageUrl.value,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: profileImageUrl.value,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: profileImageUrl.value,
      },
    ] : []),
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: jsonLd,
    },
  ],
  style: [
    {
      children: fontStyle,
      type: "text/css",
    },
  ],
});

useSeoMeta({
  title: () => userName.value,
  description: () => userBio.value,
  author: "Qshot",
  ogType: "website",
  ogTitle: () => userName.value,
  ogDescription: () => userBio.value,
  ogUrl: () => url.origin,
  ogLocale: () => "en",
  twitterTitle: () => userName.value,
  twitterDescription: () => userBio.value,
  twitterCard: "summary_large_image",
  twitterSite: () => userName.value,
  twitterCreator: () => userName.value,
  ...(profileImage.value && profileImage.value !== '/logo-only.svg' ? { twitterImage: () => profileImageUrl.value } : {}),
});

if (profileImage.value && profileImage.value !== '/logo-only.svg') {
  defineOgImage({
    url: profileImageUrl.value,
    width: 1200,
    height: 630,
    alt: userName.value,
  });
}
</script>

<template>
  <section
    class="relative bg-cover min-h-screen bg-fixed bg-center hero-bg overflow-hidden w-full max-w-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-3xl md:rounded-xl shadow-md"
    :style="[
      backgroundSettings?.image
        ? 'background-image: url(' +
          (backgroundSettings.image === '/wallpaper.jpg'
            ? url.origin
            : imageServer) +
          backgroundSettings.image +
          ')'
        : 'background:' + numberToHex(bgColor) + ';',
      { '--page-font-color': pageFontColorRgb }
    ]"
  >
    <component :is="heroComponent" v-bind="heroProps" />
    <component :is="headerComponent" v-bind="headerProps" />
    <div class="relative mx-auto flex max-w-7xl flex-col justify-center gap-4">
      <div
        class="absolute -top-8 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/25 blur-[120px] lg:-top-8 lg:size-[32rem] lg:blur-[200px]"
      />
      <div class="relative w-full">
        <ClientOnly>
          <!-- <HomeSocial
            :socials="profile?.info?.social_links"
          ></HomeSocial> -->
          <br/>
          <LazyHomeVcf
            v-if="
              !('can_save_contact' in settings) ||
              settings.can_save_contact === true
            "
            :userTemplateProfile="profile"
          ></LazyHomeVcf>
          <HomeModules
            :modules="profile?.info?.modules"
            :subdomainName="subdomainName"
          ></HomeModules>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* لون النص الافتراضي من settings.font_color لجميع المحتوى داخل الصفحة (بما فيه ClientOnly والـ modules) */
/* تجاهل دارك/لايت مود الجهاز واستخدام ألوان الصفحة فقط */
.hero-bg {
  color: var(--page-font-color);
  color-scheme: normal;
}
</style>
