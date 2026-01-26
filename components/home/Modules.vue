<script setup lang="ts">
const { ImageServer } = useAppConfig();
interface Props {
  modules: Array;
  subdomainName: any;
}

const props = defineProps<Props>();

function addIsOpenToModules() {
  return props.modules.map((module) => ({
    ...module,
    isOpen: false,
  }));
}
const updatedModules = addIsOpenToModules();
function toggleOpen(module: any) {
  if (module.foldable) {
    module.isOpen = !module.isOpen;
  }
}
function getTextDirectionAlign(text: string) {
  if (text) {
    const firstChar = text.trim().charAt(0);

    const rtlCharRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    return rtlCharRegex.test(firstChar)
      ? "text-align:right;"
      : "text-align:left;";
  }
  return "";
}
</script>
<template>
  <div v-for="module in props.modules" :key="module" class="w-100">
    <div v-if="module.type === 'ProductsModule'" class="p-5">
      <!-- {{ module.type }} -->
      <div
        class="flex W-full justify-between items-center cursor-pointer"
        @click="toggleOpen(module)"
      >
        <h3
          class="text-2xl w-full"
          :style="getTextDirectionAlign(module.title)"
        >
          {{ module.title }}
        </h3>
        <div v-if="module.foldable">
          <div
            :class="[module.isOpen ? 'rotate-[225deg]' : 'rotate-[45deg]']"
            class="w-[10px] h-[10px] transition-all duration-500 ease-in-out border-white-600 border-r-2 border-b-2 transform border-white"
          ></div>
        </div>
      </div>
      <div
        class="w-100 d-inline transition-all duration-500 ease-in-out"
        :class="
          module.foldable ? (module.isOpen ? 'show-open' : 'hide-open') : ''
        "
      >
        <LayoutGrid
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'grid'"
        ></LayoutGrid>
        <LayoutSwiper
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'swiper'"
        ></LayoutSwiper>
        <LayoutSwiper2
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'swiper2'"
        ></LayoutSwiper2>
        <LayoutList
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'list'"
        ></LayoutList>
        <hr style="border-top: 1px solid #ffffff30" />
      </div>
    </div>
    <div v-if="module.type === 'ExternalLinksModule'" class="p-5">
      <!-- {{ module.type }} -->
      <div
        class="flex W-full justify-between items-center cursor-pointer"
        @click="toggleOpen(module)"
      >
        <h3
          class="text-2xl w-full"
          :style="getTextDirectionAlign(module.title)"
        >
          {{ module.title }}
        </h3>
        <div v-if="module.foldable">
          <div
            :class="[module.isOpen ? 'rotate-[225deg]' : 'rotate-[45deg]']"
            class="w-[10px] h-[10px] transition-all duration-500 ease-in-out border-white-600 border-r-2 border-b-2 transform border-white"
          ></div>
        </div>
      </div>
      <div
        class="w-100 d-inline transition-all duration-500 ease-in-out"
        :class="
          module.foldable ? (module.isOpen ? 'show-open' : 'hide-open') : ''
        "
      >
        <LazyExternalLayoutGrid
          :items="module.links"
          :moduleType="module.type"
          v-if="module.layout_type === 'grid'"
        ></LazyExternalLayoutGrid>
        <LazyExternalLayoutSwiper
          :items="module.links"
          :moduleType="module.type"
          v-if="module.layout_type === 'swiper'"
        ></LazyExternalLayoutSwiper>
        <LazyExternalLayoutSwiper2
          :items="module.links"
          :moduleType="module.type"
          v-if="module.layout_type === 'swiper2'"
        ></LazyExternalLayoutSwiper2>
        <LazyExternalLayoutList
          :items="module.links"
          :moduleType="module.type"
          v-if="module.layout_type === 'list'"
        ></LazyExternalLayoutList>
        <hr style="border-top: 1px solid #ffffff30" />
      </div>
    </div>
    <div v-if="module.type === 'HeaderModule'" class="p-5 pb-0 font-">
      <h2
        class=""
        :style="
          'font-size:' + module.size + 'px;text-align:' + module.align + ';'
        "
      >
        {{ module.value }}
      </h2>
    </div>
    <div v-if="module.type === 'ParagraphModule'" class="p-5">
      <HomeBaseRichText :content="module.content" />
    </div>
    <div v-if="module.type === 'ImageModule'" class="p-5">
      <NuxtImg
        v-if="module?.version !== 2"
        loading="lazy"
        width="96"
        v-blur-on-load
        :src="ImageServer + module.image"
        class="w-full rounded-md border-gray-800/30 object-cover"
        alt="image"
      />
      <div v-else>
        <div v-if="module.items.length > 1 && module.version">
          <LazyImageLayoutSwiper
            :items="module.items"
            v-if="module.layout_type === 'swiper'"
          ></LazyImageLayoutSwiper>
          <LazyImageLayoutCarousel
            :items="module.items"
            v-if="module.layout_type === 'carousel'"
          ></LazyImageLayoutCarousel>
          <LazyImageLayoutShorts
            :items="module.items"
            v-if="module.layout_type === 'shorts'"
          ></LazyImageLayoutShorts>
          <LazyImageLayoutStories
            :items="module.items"
            v-if="module.layout_type === 'stories'"
          ></LazyImageLayoutStories>
          <LazyImageLayoutCards
            :items="module.items"
            v-if="module.layout_type === 'cards'"
          ></LazyImageLayoutCards>
        </div>
        <div v-else>
          <NuxtImg
            loading="lazy"
            width="96"
            v-blur-on-load
            :src="ImageServer + module.items[0]?.url"
            class="w-full rounded-md border-gray-800/30 object-cover"
            alt="image"
          />
        </div>
      </div>
    </div>
    <div v-if="module.type === 'DividerModule'" class="p-5">
      <hr
        :style="
          'border-top: ' + module.space + 'px solid ' + module.color + ';'
        "
      />
    </div>
    <div
      v-if="module.type === 'SpacerModule'"
      :style="
        'margin-top:' +
        module.space / 2 +
        'px;margin-bottom:' +
        module.space / 2 +
        'px;'
      "
      class="p-5"
    ></div>

    <div v-if="module.type === 'VideoLinksModule'" class="p-5">
      <!-- {{ module.type }} -->
      <div
        class="flex W-full justify-between items-center cursor-pointer"
        @click="toggleOpen(module)"
      >
        <h3
          class="text-2xl w-full"
          :style="getTextDirectionAlign(module.title)"
        >
          {{ module.title }}
        </h3>
        <div v-if="module.foldable">
          <div
            :class="[module.isOpen ? 'rotate-[225deg]' : 'rotate-[45deg]']"
            class="w-[10px] h-[10px] transition-all duration-500 ease-in-out border-white-600 border-r-2 border-b-2 transform border-white"
          ></div>
        </div>
      </div>
      <div
        class="w-100 d-inline transition-all duration-500 ease-in-out"
        :class="
          module.foldable ? (module.isOpen ? 'show-open' : 'hide-open') : ''
        "
      >
        <LazyVideosLayoutGrid
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'grid'"
        ></LazyVideosLayoutGrid>
        <LazyVideosLayoutSwiper
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'swiper'"
        ></LazyVideosLayoutSwiper>
        <LazyVideosLayoutList
          :items="module.items"
          :moduleType="module.type"
          v-if="module.layout_type === 'list'"
        ></LazyVideosLayoutList>
        <hr style="border-top: 1px solid #ffffff30" />
      </div>
    </div>
    <div v-if="module.type === 'SocialFeedModule'" class="p-5">
      <!-- <h3 class="text-2xl">{{ module.layout_type }}</h3> -->
      <h3 class="text-2xl w-full" :style="getTextDirectionAlign(module.title)">
        {{ module.title }}
      </h3>
      <div
        class="w-100 d-inline"
        v-if="
          module.configuration === 'vimeo' || module.configuration === 'youtube'
        "
      >
        <LazySocialFeedGrid
          :configuration="module.configuration"
          :info="module.info"
          :moduleType="module.type"
          :posts_count="module.posts_count"
          v-if="module.layout_type === 'grid'"
        ></LazySocialFeedGrid>
        <LazySocialFeedSwiper
          :configuration="module.configuration"
          :info="module.info"
          :moduleType="module.type"
          :posts_count="module.posts_count"
          v-if="module.layout_type === 'swiper'"
        ></LazySocialFeedSwiper>
        <LazySocialFeedList
          :configuration="module.configuration"
          :info="module.info"
          :moduleType="module.type"
          :posts_count="module.posts_count"
          v-if="module.layout_type === 'list'"
        ></LazySocialFeedList>
      </div>
      <div class="w-100 d-inline" v-if="module.configuration === 'instagram'">
        <LazySocialFeedInstagramGrid
          :module="module"
        ></LazySocialFeedInstagramGrid>
      </div>
    </div>
    <div v-if="module.type === 'ButtonModule'" class="p-5">
      <NuxtLink
        target="_blank"
        v-track-click="{ moduleType: module.type, moduleName: module.title }"
        :to="module.url"
      >
        <div
          class="w-full relative p-8 rounded-l-2xl rounded-r-2xl"
          style="background-color: #ffffff19; backdrop-filter: blur(4px)"
        >
          <div
            class="w-auto absolute left-[10px] top-[50%]"
            style="transform: translateY(-50%)"
          >
            <NuxtImg
              loading="lazy"
              width="96"
              v-blur-on-load
              :src="ImageServer + module.icon"
              class="w-16 h-16 rounded-md border-gray-800/30 object-cover"
              alt="image"
            />
          </div>
          <div class="w-full text-center">
            <h3 class="text-2xl ml-[65px]">{{ module.title }}</h3>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div v-if="module.type === 'LocationModule'" class="p-5">
      <LazyLocationModuleMap :module="module"></LazyLocationModuleMap>
    </div>
    <div v-if="module.type === 'FormModule'" class="p-5">
      <LazyFormModuleForm
        :subdomainName="subdomainName"
        :module="module"
      ></LazyFormModuleForm>
    </div>
    <div v-if="module.type === 'EmbedModule'" class="p-5">
      <LazyEmbedModule
        :subdomainName="subdomainName"
        :module="module"
      ></LazyEmbedModule>
    </div>
    <div v-if="module.type === 'IntroductionVideoModule'" class="p-5">
      <LazyIntroductionVideoModule
        :module="module"
      ></LazyIntroductionVideoModule>
    </div>
    <div v-if="module.type === 'social_links' && module.links && module.links.length > 0" class="p-5">
      <HomeSocial
        :socials="module"
      ></HomeSocial>
    </div>
  </div>
</template>
<style scoped>
.p-5 {
  padding-top: 15px !important;
  padding-bottom: 5px !important;
}
.hide-open {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: all 0.3s;
}
.show-open {
  opacity: 1;
  height: 100%;
  transition: all 0.3s;
}
</style>
