<template>
  <!-- Header Background -->
  <!-- <div
    v-if="accountInfo && accountInfo.data?.user_template_profile?.settings?.header?.hide !== true && accountInfo.data?.user_template_profile?.settings?.header?.background_color"
    class="absolute top-0 left-0 w-full h-20 z-10"
  ></div> -->
  
  <div
    class="w-full absolute z-12 top-0 left-0 p-5"
    style="z-index: 12"
    
  >
    <!-- Navbar Wrapper -->
    <div 
      class="flex items-center rounded-xl px-2 py-2 relative w-full"
      :class="{
        'justify-between': logoAlignment === 'start' || logoAlignment === 'left',
        'justify-end': logoAlignment === 'center',
        'justify-between flex-row-reverse': logoAlignment === 'end' || logoAlignment === 'right'
      }"
      :style="accountInfo && accountInfo.data?.user_template_profile?.settings?.header?.background_color ? `
        background-color: ${numberToHexText(accountInfo.data.user_template_profile.settings.header.background_color)};
        opacity: ${accountInfo.data.user_template_profile.settings.header.background_opacity || 1};
      ` : ''"
    >
      <!-- Logo Section Start/Left -->
      <div 
        v-if="logoAlignment === 'start' || logoAlignment === 'left'"
        class="flex items-center gap-2"
      >
        <NuxtLink to="/" class="text-white text-lg font-bold flex items-center gap-2">
          <NuxtImg
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-10  rounded object-cover"
          />
          <span v-if="route.path !== '/' && profileName" class="text-white text-lg font-bold">
            {{ profileName }}
          </span>
        </NuxtLink>
      </div>

      <!-- Logo Center -->
      <div 
        v-if="logoAlignment === 'center'"
        class="absolute left-1/2 transform -translate-x-1/2"
      >
        <NuxtLink to="/" class="text-white text-lg font-bold flex items-center gap-2">
          <NuxtImg
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-10 h-10 rounded object-cover"
          />
          <span v-if="route.path !== '/' && profileName" class="text-white text-lg font-bold">
            {{ profileName }}
          </span>
        </NuxtLink>
      </div>

      <!-- Logo Section End/Right -->
      <div 
        v-if="logoAlignment === 'end' || logoAlignment === 'right'"
        class="flex items-center gap-2"
      >
        <NuxtLink to="/" class="text-white text-lg font-bold flex items-center gap-2">
            <span v-if="route.path !== '/' && profileName" class="text-white text-lg font-bold">
            {{ profileName }}
          </span>
          <NuxtImg
            :src="logoImage"
            alt="Logo"
            width="40"
            class="w-10 h-10 rounded object-cover"
          />
        
        </NuxtLink>
      </div>

      <!-- Burger Menu - Start/Left: يمين | Center: يمين | End/Right: يسار -->
      <div>
        <button
          class="flex p-2 flex-col justify-center items-center group"
          @click="toggleMenu"
        >
          <span
            :class="[
              'w-6 h-[2px] bg-current mb-[5px] transition-all duration-300',
              isOpen ? 'rotate-45 translate-y-[7px]' : '',
            ]"
          ></span>
          <span
            :class="[
              'w-6 h-[2px] bg-current mb-[5px] transition-all duration-300',
              isOpen ? 'opacity-0' : '',
            ]"
          ></span>
          <span
            :class="[
              'w-6 h-[2px] bg-current transition-all duration-300',
              isOpen ? '-rotate-45 -translate-y-[7px]' : '',
            ]"
          ></span>
        </button>
      </div>
      <!-- Desktop Menu -->
      <!-- <div class="md:hidden md:flex gap-4">
        <NuxtLink
          class="nav-icon text-white p-2 group"
          :class="{ 'active-route': $route.path === '/' }"
          to="/"
        >
          Home
        </NuxtLink>

        <NuxtLink
          v-for="item in sortedArray"
          :key="item.id"
          :to="'/' + item.urlName"
          class="nav-icon text-white p-2 group"
          :class="{ 'active-route': $route.path === '/' + item.urlName }"
        >
          {{ item.listName }}
        </NuxtLink>
      </div> -->
    </div>

    <!-- Mobile Dropdown Menu -->
    <div
      v-show="isOpen"
      class="mt-3 flex flex-col gap-2 border-[1px] border-[#ffffff20] rounded-xl p-4"
      style="backdrop-filter: blur(20px); background: #00000050"
    >
      <NuxtLink
        class="nav-icon text-white p-2 group"
        :class="{ 'active-route': $route.path === '/' }"
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
        :class="{ 'active-route': $route.path === '/' + item.urlName }"
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
const { ImageServer } = useAppConfig();
const imageServer = ImageServer;

interface AccountInfo {
  data: {
    user_template_profile: {
      info?: {
        seo_meta?: {
          title: string;
          image: string;
        };
      };
      settings: {
        name?: {
          text: string;
        };
        logo?: {
          image_url: string;
          alignment?: 'left' | 'center' | 'right' | 'start' | 'end';
        };
        header?: {
          logo_alignment?: 'left' | 'center' | 'right' | 'start' | 'end';
          hide?: boolean;
          background_color?: number;
          background_opacity?: number;
        };
        profile_picture?: {
          image_url: string;
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

// دالة لتحويل رقم اللون إلى RGB
function numberToHexText(num: number) {
  // Extracting red, green, and blue components
  var red = (num >> 16) & 0xff;
  var green = (num >> 8) & 0xff;
  var blue = num & 0xff;

  // Returning the RGB components as a string
  return `rgb(${red}, ${green}, ${blue})`;
}

const props = defineProps({
  pages_list: {
    type: Array as () => Array<{
      id: number;
      urlName: string;
      listName: string;
      order: number;
    }>,
    required: true,
  },
});

const sortedArray = computed(() => {
  if (!props.pages_list || props.pages_list.length === 0) {
    return [];
  }
  return props.pages_list.slice().sort((a, b) => a.order - b.order);
});

const currentPageName = computed(() => {
  if (route.path === "/") return "Home";
  const found = sortedArray.value.find(
    (item) => route.path === "/" + item.urlName
  );
  return found ? found.listName : "";
});

const profileName = computed(() => {
  const title = accountInfo.value?.data?.user_template_profile?.info?.seo_meta?.title || 
                accountInfo.value?.data?.user_template_profile?.settings?.name?.text || 
                accountInfo.value?.data?.user_template_profile?.name || '';
  return title.split('|')[0].trim();
});

// تحديد محاذاة اللوغو من الإعدادات
const logoAlignment = computed(() => {
  const alignment = accountInfo.value?.data?.user_template_profile?.settings?.header?.logo_alignment ||
                    accountInfo.value?.data?.user_template_profile?.settings?.logo?.alignment ||
                    'start'; // افتراضي: start
  
  // التأكد من أن القيمة صحيحة ودعم start/end و left/right
  if (alignment === 'start' || alignment === 'left') {
    return 'start';
  } else if (alignment === 'center') {
    return 'center';
  } else if (alignment === 'end' || alignment === 'right') {
    return 'end';
  }
  return 'start'; // افتراضي إذا كانت القيمة غير صحيحة
});

// تحديد موضع البرغر مينو بناءً على موضع اللوغو
const burgerPosition = computed(() => {
  const alignment = logoAlignment.value;
  if (alignment === 'left') {
    return 'right'; // لوغو يسار = برغر يمين
  } else if (alignment === 'center') {
    return 'right'; // لوغو وسط = برغر يمين
  } else {
    return 'left'; // لوغو يمين = برغر يسار
  }
});

// الحصول على اللوغو مع القيمة الافتراضية
const logoImage = computed(() => {
  const logo = accountInfo.value?.data?.user_template_profile?.info?.seo_meta?.image || 
               accountInfo.value?.data?.user_template_profile?.settings?.logo?.image_url || 
               accountInfo.value?.data?.user_template_profile?.settings?.profile_picture?.image_url ||
               '/logo-only.svg';
  // إذا كان اللوغو من الـ response (ليس logo-only.svg)، نضيف imageServer، وإلا نستخدم المسار المباشر
  if (logo === '/logo-only.svg') {
    return logo;
  }
  return imageServer + logo;
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
