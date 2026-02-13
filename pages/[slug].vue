<script setup>
const url = useRequestURL();
const { ImageServer } = useAppConfig();
import { useNuxtApp } from "#app";
import { sendRedirect } from "h3";
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
    if (host.includes("quazax.com")) {
      return host.replace("quazax.com", "speaknet.app");
    }
    return host + url.pathname;
  }
}

function getUpdatedUrl() {
  const host = url.hostname;
  const port = url.port;
  const path = url.pathname;
  if (host.includes("localhost")) {
    const subdomain = host.split(".")[0];
    console.log(`${subdomain}.speaknet.app${path.slice(0, -1)}`);
    return `${subdomain}.speaknet.app${path}`;
    return `${subdomain}.speaknet.app${path.slice(0, -1)}`;
  }
}

const data = ref(null);
const imageServer = ImageServer;
const subdomainName = getSubdomain();
console.log(subdomainName);
const textColor = ref(null); // Default text color
const bgColor = ref(null); // Default background color
const seoMeta = ref({});

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
  console.log(fetchedData.value);
  // Ensure the global accountInfo state is updated on every navigation.
  // useState(initializer) only sets the value once; overwrite explicitly so
  // client-side navigations update the navbar/profile immediately.
  const accountInfo = useState("accountInfo");
  accountInfo.value = fetchedData.value;

  if (fetchedData.value.data.type === "redirect") {
    const event = nuxtApp.ssrContext?.event;
    if (event) {
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
  
  //if image or color
  if (!data.value.data.user_template_profile.settings.background?.image) {
    if (
      !fetchedData.value.data.user_template_profile.settings.background
        ?.color_value
    ) {
      //set bg black by defulte
      if (!data.value.data.user_template_profile.settings.background) {
        data.value.data.user_template_profile.settings.background = {};
      }
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

  //meta - check if seo_meta exists in info, otherwise use settings
  // bio is now an object with text and hide properties
  const bioText = typeof data.value.data.user_template_profile.settings.bio === 'string'
    ? data.value.data.user_template_profile.settings.bio
    : (data.value.data.user_template_profile.settings.bio?.text || '');
  
  seoMeta.value = data.value.data.user_template_profile.info?.seo_meta || {
    title: data.value.data.user_template_profile.settings.name?.text || data.value.data.user_template_profile.name || '',
    description: bioText,
    image: data.value.data.user_template_profile.settings.profile_picture?.image_url || data.value.data.user_template_profile.settings.logo?.image_url || '/logo-only.svg',
    show_app_name: false
  };
} else {
  console.error("Subdomain not found in the URL");
}

// Computed properties لتسهيل الوصول للبيانات (يجب تعريفها قبل الدوال التي تستخدمها)
const profile = computed(() => data.value?.data?.user_template_profile || null);
const settings = computed(() => profile.value?.settings || {});
const backgroundSettings = computed(() => settings.value?.background);
const pagesList = computed(() => data.value?.data?.pages_list || []);

// نفس هيدر الستايل المستخدم في الصفحة الرئيسية
const heroStyle = computed(() => settings.value?.style || "style1");
const headerComponents = {
  style1: HomeHeaderStyle1,
  style2: HomeHeaderStyle2,
};
const headerComponent = computed(
  () => headerComponents[heroStyle.value] || HomeHeaderStyle1
);
const headerProps = computed(() => ({ pages_list: pagesList.value }));

const seoImageUrl = computed(() => {
  if (!seoMeta.value.image || seoMeta.value.image === '/logo-only.svg') {
    return seoMeta.value.image || '/logo-only.svg';
  }
  return imageServer + seoMeta.value.image;
});

// لون النص الافتراضي من settings.font_color (للتوريث على كل النص داخل الصفحة)
const pageFontColorRgb = computed(() =>
  textColor.value != null ? numberToHexText(textColor.value) : 'rgb(255, 255, 255)'
);

//load font
const fontName = computed(() => settings.value?.font_family || 'Inter');
const fontUrl = computed(() => `https://fonts.googleapis.com/css2?family=${fontName.value}:wght@100;200;300;400&display=swap`);
const fontStyle = computed(() => `
  * {
    font-family: '${fontName.value}', sans-serif !important;
  }
`);

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

// if show app name
if (seoMeta.value.show_app_name) {
  seoMeta.value.title = seoMeta.value.title + " | Qshot";
}

useHead({
  title: seoMeta.value.title || 'Qshot',
  titleTemplate: seoMeta.value.title || 'Qshot',
  link: [
    {
      rel: "stylesheet",
      href: fontUrl,
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
  title: () => seoMeta.value.title || '',
  description: () => seoMeta.value.description || '',
  author: "Qshot",
  ogType: "website",
  ogTitle: () => seoMeta.value.title || '',
  ogDescription: () => seoMeta.value.description || '',
  ogUrl: () => url.origin,
  ogLocale: () => "en",
  twitterTitle: () => seoMeta.value.title || '',
  twitterDescription: () => seoMeta.value.description || '',
  twitterCard: "summary_large_image",
  twitterSite: () => seoMeta.value.title || '',
  twitterCreator: () => seoMeta.value.title || '',
  ...(seoMeta.value.image ? { twitterImage: () => seoImageUrl.value } : {}),
});

if (seoMeta.value.image) {
  defineOgImage({
    url: seoImageUrl.value,
    width: 1200,
    height: 630,
    alt: seoMeta.value.title || '',
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
    <component :is="headerComponent" v-bind="headerProps" />
    <!-- grid -->
    <!-- <div
      class="pointer-events-none absolute inset-0 bg-center bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]"
    /> -->

    <div class="relative mx-auto flex max-w-7xl flex-col justify-center gap-4">
      <!-- spotlight -->
      <div
        class="absolute -top-8 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/25 blur-[120px] lg:-top-8 lg:size-[32rem] lg:blur-[200px]"
      />

      <div class="relative w-full">
        <!-- <div class="grid place-items-center mt-32">
          <HomeProfilePicture
            v-if="data.data.user_template_profile.settings.show_profile_picture"
            :image="imageServer + data.data.user_template_profile.info.image"
          />
          <br />
          <h1
            v-if="data.data.user_template_profile.settings.show_name"
            class="name_text text-6xl pr-4 pl-4 pt-4 text-center"
          >
            {{ data.data.user_template_profile.info.username }}
            <NuxtImg
              v-if="data.data.user_template_profile.verified"
              class="h-4 w-4 verified"
              src="/verified_badge.svg"
            ></NuxtImg>
          </h1>
          <h2
            v-if="data.data.user_template_profile.info.bio"
            class="bio_text text-2xl text-center pr-4 pl-4 pt-4"
          >
            <span
              v-html="
                data.data.user_template_profile.info.bio.replace(
                  /\n/g,
                  '<br />'
                )
              "
            ></span>

          </h2>
        </div> -->
        <ClientOnly>
          <!-- <HomeSocial
            :socials="data.data.user_template_profile.info.social_links"
          ></HomeSocial>
          <LazyHomeVcf
            v-if="
              !(
                'can_save_contact' in data.data.user_template_profile.settings
              ) ||
              data.data.user_template_profile.settings.can_save_contact === true
            "
            :userTemplateProfile="data.data.user_template_profile"
          ></LazyHomeVcf> -->
          <div class="mt-[70px]">
            <HomeModules
              :modules="profile?.info?.modules"
              :subdomainName="subdomainName"
            ></HomeModules>
          </div>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* لون النص الافتراضي من settings.font_color لجميع المحتوى داخل الصفحة */
/* تجاهل دارك/لايت مود الجهاز واستخدام ألوان الصفحة فقط */
.hero-bg {
  color: var(--page-font-color);
  color-scheme: normal;
}
.bio_text {
  opacity: 0.8;
}
.verified {
  display: inline-block;
  /* vertical-align: baseline; */
  transform: scale(2);
  margin-bottom: 2px;
}
@media (max-width: 991px) {
  .name_text {
    /* font-size: calc(30px - 20%); */
    /* font-size: calc(4vw + 5px); */
    font-size: 24px;
  }
  .bio_text {
    font-size: 16px;
    /* font-size: calc(20px - 20%); */
  }
  .verified {
    display: inline-block;
    /* vertical-align: bottom; */
    transform: scale(1.2);
    margin-bottom: 2px;
  }
}
</style>
