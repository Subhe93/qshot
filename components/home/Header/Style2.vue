<template>
  <div
    v-if="headerVisible"
    class="w-full absolute z-12 top-0 left-0  py-0 min-h-[72px] flex items-center"
    style="z-index: 12"
  >
    <div
      class="flex items-center relative w-full min-h-[72px] px-5"
      :class="{
        'justify-between': titleAlignment === 'start' || titleAlignment === 'left',
        'justify-end': titleAlignment === 'center',
        'justify-between flex-row-reverse': titleAlignment === 'end' || titleAlignment === 'right'
      }"
      :style="headerBarStyle"
    >
      <!-- Title from header_text (e.g. Brand Name) - alignment from header.leading_alignment -->
      <NuxtLink
        v-if="titleAlignment === 'start' || titleAlignment === 'left' || titleAlignment === 'end' || titleAlignment === 'right'"
        to="/"
        class="text-lg font-bold"
        :style="{ color: headerTextColor }"
      >
        {{ headerTitle }}
      </NuxtLink>
      <NuxtLink
        v-if="titleAlignment === 'center'"
        to="/"
        class="absolute left-1/2 -translate-x-1/2 text-lg font-bold"
        :style="{ color: headerTextColor }"
      >
        {{ headerTitle }}
      </NuxtLink>

      <!-- Burger Menu when sub-pages exist -->
      <div v-if="sortedArray.length > 0">
        <button
          class="flex p-2 flex-col justify-center items-center group"
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
      class="absolute left-5 right-5 top-full mt-2 flex flex-col gap-2 border-[1px] border-[#ffffff20] rounded-xl p-4 z-20"
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
        :key="item.id"
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

interface AccountInfo {
  data: {
    user_template_profile: {
      settings: {
        header?: {
          leading_alignment?: string;
          hide?: boolean;
          background_color?: number;
          background_opacity?: number;
        };
        header_text?: { hide?: boolean; text?: string; color?: number };
        font_color?: number;
      };
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
    type: Array as () => Array<{ id: number; urlName: string; listName: string; order: number }>,
    required: true,
  },
});

const sortedArray = computed(() => {
  if (!props.pages_list || props.pages_list.length === 0) return [];
  return props.pages_list.slice().sort((a, b) => a.order - b.order);
});

const headerText = computed(() => accountInfo.value?.data?.user_template_profile?.settings?.header_text);
const headerSettings = computed(() => accountInfo.value?.data?.user_template_profile?.settings?.header);

const titleAlignment = computed(() => {
  const alignment = headerSettings.value?.leading_alignment || "start";
  if (alignment === "start" || alignment === "left") return "start";
  if (alignment === "center") return "center";
  if (alignment === "end" || alignment === "right") return "end";
  return "start";
});

const headerVisible = computed(() => {
  if (headerSettings.value?.hide === true) return false;
  const hasTitle = !!(headerText.value?.text && headerText.value?.hide !== true);
  if (hasTitle) return true;
  if (sortedArray.value.length > 0) return true;
  return false;
});

const headerTitle = computed(() => headerText.value?.text?.trim() || "QShot");

const headerTextColor = computed(() => {
  const color = headerText.value?.color;
  if (color != null) return numberToHexText(color);
  const fontColor = accountInfo.value?.data?.user_template_profile?.settings?.font_color;
  if (fontColor != null) return numberToHexText(fontColor);
  return "rgb(255, 255, 255)";
});

const headerBarStyle = computed(() => {
  const header = headerSettings.value;
  if (header?.background_color != null) {
    return {
      backgroundColor: numberToHexText(header.background_color),
      opacity: header.background_opacity ?? 1,
    };
  }
  return { backgroundColor: "rgb(0, 0, 0)", opacity: 1 };
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
