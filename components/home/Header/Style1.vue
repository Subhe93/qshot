<template>
  <div
    v-if="headerVisible"
    class="w-full absolute z-12 top-0 left-0 p-5"
    style="z-index: 12"
  >
    <div
      class="flex items-center rounded-xl px-2 py-2 relative w-full"
      :class="{
        'justify-between': logoAlignment === 'start' || logoAlignment === 'left',
        'justify-end': logoAlignment === 'center',
        'justify-between flex-row-reverse': logoAlignment === 'end' || logoAlignment === 'right'
      }"
      :style="headerBarStyle"
    >
      <div
        v-if="logoAlignment === 'start' || logoAlignment === 'left'"
        class="flex items-center gap-2"
      >
        <NuxtLink to="/" class="text-lg font-bold flex items-center gap-2" :style="{ color: headerNameColor }">
          <NuxtImg
            v-if="logoImage"
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-10 rounded object-cover"
          />
          <span v-if="route.path !== '/' && profileName && !nameHiddenInHeader" class="text-lg font-bold">
            {{ profileName }}
          </span>
        </NuxtLink>
      </div>

      <div
        v-if="logoAlignment === 'center'"
        class="absolute left-1/2 transform -translate-x-1/2"
      >
        <NuxtLink to="/" class="text-lg font-bold flex items-center gap-2" :style="{ color: headerNameColor }">
          <NuxtImg
            v-if="logoImage"
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-8 h-8 rounded object-cover"
          />
          <span v-if="route.path !== '/' && profileName && !nameHiddenInHeader" class="text-lg font-bold">
            {{ profileName }}
          </span>
        </NuxtLink>
      </div>

      <div
        v-if="logoAlignment === 'end' || logoAlignment === 'right'"
        class="flex items-center gap-2"
      >
        <NuxtLink to="/" class="text-lg font-bold flex items-center gap-2" :style="{ color: headerNameColor }">
          <span v-if="route.path !== '/' && profileName && !nameHiddenInHeader" class="text-lg font-bold">
            {{ profileName }}
          </span>
          <NuxtImg
            v-if="logoImage"
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-8 h-8 rounded object-cover"
          />
        </NuxtLink>
      </div>

      <div v-if="sortedArray.length > 0">
        <button
          class="flex p-2 flex-col justify-center items-center group"
          :style="{ color: headerNameColor }"
          @click="toggleMenu"
        >
          <span
            :class="[
              'w-6 h-[2px] bg-current mb-[5px] transition-all duration-300',
              isOpen ? 'rotate-45 translate-y-[7px]' : '',
            ]"
          />
          <span
            :class="[
              'w-6 h-[2px] bg-current mb-[5px] transition-all duration-300',
              isOpen ? 'opacity-0' : '',
            ]"
          />
          <span
            :class="[
              'w-6 h-[2px] bg-current transition-all duration-300',
              isOpen ? '-rotate-45 -translate-y-[7px]' : '',
            ]"
          />
        </button>
      </div>
    </div>

    <div
      v-if="sortedArray.length > 0"
      v-show="isOpen"
      class="mt-3 flex flex-col gap-2 border-[1px] border-[#ffffff20] rounded-xl p-4"
      style="backdrop-filter: blur(20px); background: #00000050"
    >
      <NuxtLink
        class="nav-icon text-white p-2 group"
        :class="{ 'active-route': route.path === '/' }"
        to="/"
        @click="toggleMenu"
      >
        Home
      </NuxtLink>
      <NuxtLink
        v-for="item in sortedArray"
        :key="item._id || item.id"
        :to="'/' + item.urlName"
        class="nav-icon text-white p-2 group"
        :class="{ 'active-route': route.path === '/' + item.urlName }"
        @click="toggleMenu"
      >
        {{ item.listName }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { numberToHexText } from "~/composables/useHeroHelpers";

const { ImageServer } = useAppConfig();
const imageServer = ImageServer;

interface AccountInfo {
  data: {
    user_template_profile: {
      info?: { seo_meta?: { title: string; image: string } };
      settings: {
        font_color?: number;
        name?: { text: string; hide?: boolean };
        logo?: { image_url: string | null; alignment?: string; hide?: boolean };
        header?: {
          leading_alignment?: string;
          logo_alignment?: string;
          hide?: boolean;
          background_color?: number;
          background_opacity?: number;
        };
      };
      name?: string;
    };
  };
}

const accountInfo = useState<AccountInfo | null>("accountInfo");
const route = useRoute();
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const props = defineProps({
  pages_list: {
    type: Array as () => Array<{ id?: number; _id?: string; urlName: string; listName: string; order: number }>,
    required: true,
  },
});

const sortedArray = computed(() => {
  if (!props.pages_list || props.pages_list.length === 0) return [];
  return props.pages_list.slice().sort((a, b) => a.order - b.order);
});

const headerVisible = computed(() => {
  const hide = accountInfo.value?.data?.user_template_profile?.settings?.header?.hide;
  if (hide === true) return false;
  if (sortedArray.value.length > 0) return true;
  if (logoImage.value) return true;
  return false;
});

const nameHiddenInHeader = computed(() => {
  return accountInfo.value?.data?.user_template_profile?.settings?.name?.hide === true;
});

const headerBarStyle = computed(() => {
  const header = accountInfo.value?.data?.user_template_profile?.settings?.header;
  if (header?.background_color != null) {
    return {
      backgroundColor: numberToHexText(header.background_color),
      opacity: header.background_opacity ?? 1,
    };
  }
  return {};
});

const profileName = computed(() => {
  const p = accountInfo.value?.data?.user_template_profile;
  const title = p?.info?.seo_meta?.title || p?.settings?.name?.text || p?.name || "";
  return title.split("|")[0].trim();
});

const headerNameColor = computed(() => {
  const fontColor = accountInfo.value?.data?.user_template_profile?.settings?.font_color;
  if (fontColor != null) return numberToHexText(fontColor);
  return "rgb(255, 255, 255)";
});

const logoAlignment = computed(() => {
  const header = accountInfo.value?.data?.user_template_profile?.settings?.header;
  const alignment =
    header?.leading_alignment ||
    header?.logo_alignment ||
    accountInfo.value?.data?.user_template_profile?.settings?.logo?.alignment ||
    "start";
  if (alignment === "start" || alignment === "left") return "start";
  if (alignment === "center") return "center";
  if (alignment === "end" || alignment === "right") return "end";
  return "start";
});

const logoImage = computed(() => {
  const settings = accountInfo.value?.data?.user_template_profile?.settings;
  if (settings?.logo?.hide === true) return null;
  const logoUrl = settings?.logo?.image_url;
  if (!logoUrl) return null;
  return imageServer + logoUrl;
});
</script>

<style scoped>
.nav-icon {
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.active-route {
  border-bottom: 2px solid #ffffff;
  font-weight: bold;
}
.nav-icon:hover {
  border-bottom: 2px solid #ffffff;
}
</style>
