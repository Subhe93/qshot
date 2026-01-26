<script setup>
const url = useRequestURL();
const { ImageServer } = useAppConfig();
import { useNuxtApp } from "#app";
import { sendRedirect } from "h3";

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
    // return getUpdatedUrl();
    // معالجة مؤقتة: تحويل quazax.com إلى qshot.com
    if (host.includes("quazax.com")) {
      return host.replace("quazax.com", "qshot.com");
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
    console.log(`${subdomain}.qshot.com${path.slice(0, -1)}`);
    return `${subdomain}.qshot.com${path.slice(0, -1)}`;
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
  const url = `https://qshot.radiolingo.app/q-profile/user/test?${params.toString()}`;

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
const coverPhoto = computed(() => settings.value?.cover_photo);
const profilePicture = computed(() => settings.value?.profile_picture);
const nameSettings = computed(() => settings.value?.name);
const bioSettings = computed(() => settings.value?.bio);
const backgroundSettings = computed(() => settings.value?.background);
const headerSettings = computed(() => settings.value?.header);
const pagesList = computed(() => data.value?.data?.pages_list || []);

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
  ...(profileImage.value ? { image: profileImageUrl.value } : {}),
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

function getCoverPhotoAspectRatio(coverPhoto) {
  if (!coverPhoto) return 'aspect-ratio: 16 / 9;';
  
  const shape = coverPhoto.shape;
  const size = coverPhoto.size;
  
  if (shape === 'horizontal' || (!shape && size === 'horizontal')) {
    return 'aspect-ratio: 16 / 9;';
  } else if (shape === 'square' || (!shape && size === 'square')) {
    return 'aspect-ratio: 1 / 1;'; // مربع حسب عرض الشاشة
  } else if (shape === 'poster' || (!shape && size === 'poster')) {
    return 'aspect-ratio: 4 / 5;';
  } else if (shape === 'vertical' || (!shape && size === 'vertical')) {
    return 'aspect-ratio: 9 / 16;';
  } else {
    // الافتراضي horizontal إذا كانت shape و size كلاهما null
    return 'aspect-ratio: 16 / 9;';
  }
}

function getProfilePicturePosition(coverPhoto, alignment) {
  const basePosition = {
    position: 'absolute',
    'z-index': 10
  };
  
  // تحديد المحاذاة
  if (alignment === 'center' || !alignment) {
    basePosition.left = '50%';
    basePosition.transform = 'translateX(-50%)';
  } else if (alignment === 'start' || alignment === 'left') {
    basePosition.left = '1.25rem';
    basePosition.transform = 'none';
  } else if (alignment === 'end' || alignment === 'right') {
    basePosition.right = '1.25rem';
    basePosition.left = 'auto';
    basePosition.transform = 'none';
  }
  
  if (!coverPhoto || !coverPhoto.image_url || coverPhoto.hide === true) {
    // الافتراضي horizontal: الصورة الشخصية نصفها فوق cover photo والنصف الآخر أسفله  
    return {
      ...basePosition,
      bottom: 'calc(-1 * clamp(52px, 5vw, 80px))' // نصف ارتفاع الصورة (responsive) - سالب ليظهر خارج cover photo
    };
  }
  
  const shape = coverPhoto.shape;
  const size = coverPhoto.size;
  
  // إذا كان horizontal، الصورة الشخصية نصفها فوق cover photo والنصف الآخر أسفله
  // بما أن الصورة الآن داخل cover photo container، نضعها في أسفل container بحيث نصفها يظهر خارج cover photo
  if (shape === 'horizontal' || (!shape && size === 'horizontal')) {
    // الصورة الشخصية حجمها متغير: 104px على الشاشات الصغيرة، 160px على الشاشات الكبيرة
    // نصفها = 52px على الشاشات الصغيرة، 80px على الشاشات الكبيرة
    // نضعها في أسفل cover photo container بحيث نصفها يظهر خارج cover photo
    return {
      ...basePosition,
      bottom: 'calc(-1 * clamp(52px, 5vw, 80px))' // نصف ارتفاع الصورة (responsive) - سالب ليظهر خارج cover photo
    };
  } else if (shape === 'square' || (!shape && size === 'square') || shape === 'poster' || (!shape && size === 'poster') || shape === 'vertical' || (!shape && size === 'vertical')) {
    // عندما يكون square أو poster أو vertical، الصورة الشخصية في المنتصف تماماً (أفقي وعمودي)
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      'z-index': 10
    };
  } else {
    // للحالات الأخرى، تبقى absolute في موضعها الطبيعي داخل cover photo
    return {
      ...basePosition,
      bottom: '2rem'
    };
  }
}
function updateStyles(bgColor, textColor) {
  document.querySelectorAll("*").forEach((el) => {
    // Skip elements with custom colors (name, bio, etc.)
    if (el.classList.contains('name_text') || el.classList.contains('bio_text') || el.hasAttribute('data-custom-color')) {
      return;
    }
    // Skip elements that already have inline color style
    if (el.style.color && el.style.color !== '') {
      return;
    }
    el.style.color = textColor;
  });
  if (!backgroundSettings.value?.image) {
    document.body.style.background = bgColor;
  }
  // Add/update placeholder styles
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
    ...(profileImage.value ? [
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
  ...(profileImage.value ? { twitterImage: () => profileImageUrl.value } : {}),
});

if (profileImage.value) {
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
    :style="
      backgroundSettings?.image
        ? 'background-image: url(' +
          (backgroundSettings.image === '/wallpaper.jpg'
            ? url.origin
            : imageServer) +
          backgroundSettings.image +
          ')'
        : 'background:' + numberToHex(bgColor) + ';'
    "
  >
    <!-- Cover Photo -->
    <div
      v-if="coverPhoto?.hide !== true"
      class="w-full z-0 relative"
      :style="`
        ${getCoverPhotoAspectRatio(coverPhoto)}
        ${(!coverPhoto?.shape || coverPhoto?.shape === 'horizontal' || (!coverPhoto?.shape && coverPhoto?.size === 'horizontal')) ? 'margin-bottom: clamp(4rem, 3vw, 2rem);' : ''}
      `"
    >
      <!-- Cover Photo Background with Mask -->
      <div
        v-if="coverPhoto?.image_url"
        class="absolute inset-0 w-full h-full"
        :style="`
          background-image: url(${imageServer}${coverPhoto.image_url});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: ${coverPhoto.transparency || 1};
          ${coverPhoto.fade ? 'mask-image: linear-gradient(to bottom, black, transparent);' : ''}
          z-index: 0;
        `"
      ></div>
   
      <div
        v-else
        class="absolute inset-0 w-full h-full bg-transparent"
        style="z-index: 0;"
      ></div>
      
      <!-- Profile Picture - outside mask -->
      <div
        v-if="profilePicture?.hide !== true"
        class="inline-block"
        :class="{
          'rounded-full': (profilePicture?.shape || 'circle') === 'circle',
          'rounded-lg': profilePicture?.shape === 'rectangle',
          'rounded-lg': profilePicture?.shape === 'square'
        }"
        :style="{
          ...getProfilePicturePosition(coverPhoto, profilePicture?.alignment),
          border: profilePicture?.border_width ? `${profilePicture.border_width}px solid ${profilePicture.border_color ? numberToHexText(profilePicture.border_color) : 'transparent'}` : undefined
        }"
      >
        <HomeProfilePicture
          :image="profilePicture?.image_url ? imageServer + profilePicture.image_url : '/person.svg'"
          :shape="profilePicture?.shape || 'circle'"
        />
      </div>
    </div>
    
    <HomeNavbar :pages_list="pagesList"></HomeNavbar>
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
        <!-- Profile Picture Container -->
       
        
        <!-- Name and Bio Container -->
        <div class="pl-5 pr-5">
          <h1
            v-if="nameSettings?.hide !== true && nameSettings?.text"
            class="name_text text-6xl pt-4"
            :class="{
              'text-center': !nameSettings?.alignment || nameSettings?.alignment === 'center',
              'text-left': nameSettings?.alignment === 'start' || nameSettings?.alignment === 'left',
              'text-right': nameSettings?.alignment === 'end' || nameSettings?.alignment === 'right'
            }"
            :style="nameSettings?.color ? `color: ${numberToHexText(nameSettings.color)} !important;` : ''"
          >
            {{ nameSettings.text }}
            <NuxtImg
              v-if="profile?.verified"
              class="h-4 w-4 verified"
              src="/verified_badge.svg"
            ></NuxtImg>
          </h1>
          <h2
            v-if="(typeof bioSettings === 'string' ? bioSettings : bioSettings?.text) && bioSettings?.hide !== true"
            class="bio_text text-2xl text-center pr-4 pl-4 pt-4"
            :style="(typeof bioSettings === 'object' && bioSettings?.color) ? `color: ${numberToHexText(bioSettings.color)} !important;` : ''"
          >
            <span
              v-html="
                (typeof bioSettings === 'string' 
                  ? bioSettings 
                  : bioSettings?.text || '').replace(
                  /\n/g,
                  '<br />'
                )
              "
            ></span>
          </h2>
        </div>
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
