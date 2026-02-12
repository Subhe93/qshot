<script setup lang="ts">
const { ImageServer } = useAppConfig();
interface Props {
  socials: object;
}

const props = defineProps<Props>();

const visibleLinks = computed(() =>
  (props.socials?.links || []).filter((link) => !link.hidden)
);

function capitalizeFirstLetter(str: string) {
  if (props.socials.icon_type === "original") {
    return str.charAt(0).toUpperCase() + str.slice(1) + "-color";
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Define types of social media platforms
const PlatformTypes = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  TIKTOK: "tiktok",
  SNAPCHAT: "snapchat",
  WHATSAPP: "whatsapp",
  TWITTER: "twitter",
  YOUTUBE: "youtube",
  PINTEREST: "pinterest",
  TWITCH: "twitch",
  BEHANCE: "behance",
  PHONE: "phone",
  EMAIL: "email",
  WEBSITE: "website",
  VIMEO: "vimeo",
  WECHAT: "wechat",
  LOCATION: "location",
  LINK: "link",
  CUSTOM: "custom",
};

// Define configurations for each platform
const configurations = {
  facebook: {
    domain: "https://www.facebook.com/",
  },
  instagram: {
    domain: "https://www.instagram.com/",
  },
  linkedin: {
    domain: "https://www.linkedin.com/in/",
  },
  tiktok: {
    domain: "https://www.tiktok.com/",
  },
  snapchat: {
    domain: "https://www.snapchat.com/add/",
  },
  whatsapp: {
    domain: "https://wa.me/",
  },
  twitter: {
    domain: "https://twitter.com/",
  },
  youtube: {
    domain: "https://www.youtube.com/",
  },
  pinterest: {
    domain: "https://www.pinterest.com/",
  },
  twitch: {
    domain: "https://www.twitch.tv/",
  },
  behance: {
    domain: "https://www.behance.net/",
  },
  email: {
    domain: "mailto:",
  },
  phone: {
    domain: "tel:",
  },
  link: {
    domain: "",
  },
  location: {
    domain: "",
  },
  vimeo: {
    domain: "https://www.vimeo.com/",
  },
  wechat: {
    domain: "https://www.wechat.com/",
  },
  website: {
    domain: "",
  },
  custom: {
    domain: "",
  },
};

// Regex patterns
const regexPatterns = {
  facebook:
    /^https:\/\/www\.facebook\.com\/profile\.php\?id=(?<id>\d+).*$|^(?:(?:https?:\/\/)?(?:www\.)?facebook\.com\/)?(?<username>[A-Za-z0-9.]+)\/?(?:\?.*)?$/,
  instagram:
    /^(?:(?:https:\/\/)?(?:www\.)?instagram\.com\/)?(?<username>[A-Za-z0-9._]+).*$/,
  linkedin:
    /^(?:(?:https:\/\/)?(?:www\.)?linkedin\.com\/in\/)?(?<username>[A-Za-z0-9-]+).*$/,
  tiktok:
    /^(?:(?:https:\/\/)?(?:www\.)?tiktok\.com\/)?(?<username>@?[\w.-]+).*$/,
  snapchat:
    /^(?:(?:https:\/\/)?(?:www\.)?snapchat\.com\/(?:add|t)\/)?(?<username>@?[A-Za-z0-9._-]+).*$/,
  whatsapp: /^(?:(?:https:\/\/)?wa\.me\/)?(?<username>\+?\d{7,15})$/,
  twitter:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/@?)?(?<username>@?[A-Za-z0-9_]+).*$/,
  youtube:
    /^(?:(?:https:\/\/)?(?:www\.)?youtube\.com\/)?(?<username>@?[\w.-]+).*$/,
  pinterest:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:pinterest\.com|pin\.it)\/)?(?<username>@?[A-Za-z0-9._-]+).*$/,
  twitch:
    /^(?:(?:https:\/\/)?(?:www\.|m\.)?twitch\.tv\/)?(?<username>@?[A-Za-z0-9_]+).*$/,
  behance:
    /^(?:(?:https:\/\/)?(?:www\.)?behance\.net\/)?(?<username>@?[A-Za-z0-9_-]+).*$/,
  vimeo:
    /^(?:(?:https:\/\/)?(?:www\.)?vimeo\.com\/)?(?<username>@?[A-Za-z0-9_-]+).*$/,
  wechat:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:weixin\.qq\.com|wechat\.com)\/)?(?<username>@?[A-Za-z0-9._-]+).*$/,

  phone: /^\+?\d{7,15}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  link: /^.*$/,
  location: /^.*$/,
  website: /^.*$/,
  custom: /^.*$/,
};

// Function to check if the input is a valid social media platform
function isValidPlatform(platform) {
  return Object.values(PlatformTypes).includes(platform);
}

// Function to validate and format social media link
function formatSocialMediaLink(platform, input) {
  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    throw new Error("Invalid platform type");
  }

  // Get the configuration for the specified platform
  const config = configurations[platform];
  if (!config) {
    throw new Error("Platform configuration not found");
  }

  // Get the regex pattern for the specified platform
  const pattern = regexPatterns[platform];
  if (!pattern) {
    throw new Error("Platform regex pattern not found");
  }

  // Validate the input using the regex pattern
  const match = input.match(pattern);
  if (!match) {
    throw new Error(`Invalid ${platform} input format`);
  }
  if (platform === "facebook") {
    if (match.groups.id) {
      config.domain = config.domain + "profile.php?id=";
      return `${config.domain}${match.groups.id}`;
    }
  }
  // Handle special cases for email and phone
  if (
    platform === "email" ||
    platform === "phone" ||
    platform === "link" ||
    platform === "website" ||
    platform === "custom" ||
    platform === "location"
  ) {
    return `${config.domain}${input}`;
  }

  // Ensure the username group is present for platforms that require it
  if (!match.groups?.username) {
    throw new Error(`Invalid ${platform} input format`);
  }

  // Return the formatted link
  return `${config.domain}${match.groups.username}`;
}
</script>

<template>
  <div class="my-7 lg:w-50 w-100  gap-5 sm:gap-10">
    <div
      class="social-slider-start flex items-center justify-start w-full"
      v-if="props.socials.layout_type === 'layoutSlider'"
    >
      <Swiper
        :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperFreeMode]"
        :loop="false"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: true,
        }"
        :creative-effect="{
          prev: {
            shadow: false,
            translate: ['-20%', 0, -1],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }"
        :slides-per-view="'auto'"
        :space-between="12"
      >
        <SwiperSlide
          v-for="social in visibleLinks"
          :key="social.id ?? social.type"
          class="social-slide-fixed"
        >
          <NuxtLink
            v-track-click="{
              moduleType: 'SocialLinksModule',
              moduleName: social.type,
            }"
            target="_blank"
            class="flex items-center justify-start"
            :aria-label="'Go to ' + social.type + ' profile'"
            :to="formatSocialMediaLink(social.type, social.link)"
          >
            <!-- {{ "Svgo" + capitalizeFirstLetter(social.type) }} -->
            <component
              v-if="!social.icon"
              :is="'Svgo' + capitalizeFirstLetter(social.type)"
              class="social-item size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
              :font-controlled="false"
              :alt="social.type + ' logo'"
              :aria-label="social.type + ' logo'"
              :class="{
                'social-item-color': props.socials.icon_type === 'original',
                'social-item': props.socials.icon_type === 'darkFilled',
              }"
            />
            <img
              v-else
              :src="ImageServer + social.icon"
              class="social-item social-item-color size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
              :font-controlled="false"
              :alt="social.type + ' logo'"
              :aria-label="social.type + ' logo'"
            />
          </NuxtLink>
        </SwiperSlide>
      </Swiper>
    </div>
    <div
      class="gridAlignStart"
      v-if="props.socials.layout_type === 'gridAlignStart'"
    >
      <div v-for="social in visibleLinks" :key="social.id ?? social.type">
        <NuxtLink
          v-track-click="{
            moduleType: 'SocialLinksModule',
            moduleName: social.type,
          }"
          target="_blank"
          class="flex"
          :aria-label="'Go to ' + social.type + ' profile'"
          :to="formatSocialMediaLink(social.type, social.link)"
        >
          <!-- {{ "Svgo" + capitalizeFirstLetter(social.type) }} -->
          <component
            v-if="!social.icon"
            :is="'Svgo' + capitalizeFirstLetter(social.type)"
            class="social-item size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
            :class="{
              'social-item-color': props.socials.icon_type === 'original',
              'social-item': props.socials.icon_type === 'darkFilled',
            }"
          />
          <img
            v-else
            :src="ImageServer + social.icon"
            class="social-item social-item-color size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
          />
        </NuxtLink>
      </div>
    </div>
    <div
      class="gridAlignEnd"
      v-if="props.socials.layout_type === 'gridAlignEnd'"
    >
      <div v-for="social in visibleLinks" :key="social.id ?? social.type">
        <NuxtLink
          v-track-click="{
            moduleType: 'SocialLinksModule',
            moduleName: social.type,
          }"
          target="_blank"
          class="flex"
          :aria-label="'Go to ' + social.type + ' profile'"
          :to="formatSocialMediaLink(social.type, social.link)"
        >
          <!-- {{ "Svgo" + capitalizeFirstLetter(social.type) }} -->
          <component
            v-if="!social.icon"
            :is="'Svgo' + capitalizeFirstLetter(social.type)"
            class="social-item size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
            :class="{
              'social-item-color': props.socials.icon_type === 'original',
              'social-item': props.socials.icon_type === 'darkFilled',
            }"
          />
          <img
            v-else
            :src="ImageServer + social.icon"
            class="social-item social-item-color size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
          />
        </NuxtLink>
      </div>
    </div>
    <div
      class="gridAlignCenter"
      v-if="props.socials.layout_type === 'gridAlignCenter'"
    >
      <div v-for="social in visibleLinks" :key="social.id ?? social.type">
        <NuxtLink
          v-track-click="{
            moduleType: 'SocialLinksModule',
            moduleName: social.type,
          }"
          target="_blank"
          class="flex"
          :aria-label="'Go to ' + social.type + ' profile'"
          :to="formatSocialMediaLink(social.type, social.link)"
        >
          <!-- {{ "Svgo" + capitalizeFirstLetter(social.type) }} -->
          <component
            v-if="!social.icon"
            :is="'Svgo' + capitalizeFirstLetter(social.type)"
            class="social-item size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
            :class="{
              'social-item-color': props.socials.icon_type === 'original',
              'social-item': props.socials.icon_type === 'darkFilled',
            }"
          />
          <img
            v-else
            :src="ImageServer + social.icon"
            class="social-item social-item-color size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
          />
        </NuxtLink>
      </div>
    </div>
    <div
      class="grid grid-cols-[repeat(3,auto)] min-[360px]:grid-cols-[repeat(4,auto)] md:grid-cols-[repeat(auto-fill,minmax(5rem,auto))] gap-3 min-[390px]:gap-5 w-full justify-center justify-items-center max-w-full mx-auto"
      v-if="props.socials.layout_type === 'grid'"
    >
      <div
        v-for="social in visibleLinks"
        :key="social.id ?? social.type"
        class="flex flex-col items-center gap-2"
      >
        <NuxtLink
          v-track-click="{
            moduleType: 'SocialLinksModule',
            moduleName: social.type,
          }"
          target="_blank"
          class="flex flex-col items-center gap-2"
          :aria-label="'Go to ' + social.type + ' profile'"
          :to="formatSocialMediaLink(social.type, social.link)"
        >
          <component
            v-if="!social.icon"
            :is="'Svgo' + capitalizeFirstLetter(social.type)"
            class="social-item size-[4.75rem] bg-black p-4 rounded-md transition-all duration-300 hover:text-main shrink-0"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
            :class="{
              'social-item-color': props.socials.icon_type === 'original',
              'social-item': props.socials.icon_type === 'darkFilled',
            }"
          />
          <img
            v-else
            :src="ImageServer + social.icon"
            class="social-item social-item-color size-[4.75rem] bg-black p-4 rounded-md transition-all duration-300 hover:text-main shrink-0"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
          />
          <span class="text-cyan-400 text-sm font-medium text-center">
            {{ social.type.charAt(0).toUpperCase() + social.type.slice(1) }}
          </span>
        </NuxtLink>
      </div>
    </div>
    <div
      class="flex flex-col gap-3 w-full"
      v-if="props.socials.layout_type === 'list'"
    >
      <div v-for="social in visibleLinks" :key="social.id ?? social.type">
        <NuxtLink
          v-track-click="{
            moduleType: 'SocialLinksModule',
            moduleName: social.type,
          }"
          target="_blank"
          class="flex items-center gap-3"
          :aria-label="'Go to ' + social.type + ' profile'"
          :to="formatSocialMediaLink(social.type, social.link)"
        >
          <component
            v-if="!social.icon"
            :is="'Svgo' + capitalizeFirstLetter(social.type)"
            class="social-item size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main shrink-0"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
            :class="{
              'social-item-color': props.socials.icon_type === 'original',
              'social-item': props.socials.icon_type === 'darkFilled',
            }"
          />
          <img
            v-else
            :src="ImageServer + social.icon"
            class="social-item social-item-color size-10 bg-black p-2 rounded-md transition-all duration-300 hover:text-main shrink-0"
            :font-controlled="false"
            :alt="social.type + ' logo'"
            :aria-label="social.type + ' logo'"
          />
          <span class="capitalize">
            {{ social.type.charAt(0).toUpperCase() + social.type.slice(1) }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
.swiper {
  max-width: 100%;
  margin-left: 0;
}
@media (min-width: 1024px) {
  .swiper {
    margin-left: auto;
    margin-right: auto;
  }
}
.social-item {
  background-color: #000 !important;
  color: rgb(255, 255, 255) !important;
  fill: rgb(255, 255, 255) !important;
  border-radius: 10px !important;
  overflow: hidden;
}
.social-item-color {
  background-color: transparent !important;
  color: unset !important;
  padding: 0;
}
/* .social-item-color * {
  fill: revert-layer;
} */
.social-slider-start :deep(.swiper-wrapper) {
  justify-content: flex-start;
}
.social-slider-start :deep(.social-slide-fixed) {
  width: auto;
  flex-shrink: 0;
}
</style>
