<script setup lang="ts">
const { ImageServer } = useAppConfig();
interface Props {
  items: Array;
  moduleType: String;
}

const props = defineProps<Props>();
</script>
<template>
  <div class="my-4 w-100">
    <div class="swiper2grid pt-4" v-for="item in props.items" :key="item">
      <NuxtLink
        v-track-click="{ moduleType: moduleType, moduleName: item.title }"
        target="_blank"
        class="flex items-center justify-left"
        :to="item.url"
      >
        <div class="flex w-full rounded-l-2xl rounded-r-2xl overflow-hidden">
          <div class="h-32 w-32 flex-none text-center">
            <NuxtImg
              loading="lazy"
              width="96"
              v-blur-on-load
              :src="ImageServer + item.thumbnail_url"
              class="h-32 w-32 border-gray-800/30 object-cover"
              :alt="item.title"
            />
          </div>
          <div
            class="ss flex-auto w-100 p-4 flex flex-col justify-between leading-normal"
            style="background-color: #ffffff19; backdrop-filter: blur(4px)"
          >
            <div class="text-xl w-full" style="margin: auto 0">
              <div class="leading-none text-white-new text-heading-weight">
                {{ item.title }}
              </div>
              <div class="text-white-new text-base">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
<style>
/* .swiper2grid .swiper-grid-column > .swiper-wrapper {
  flex-wrap: wrap;
  flex-direction: initial !important;
} */
</style>
