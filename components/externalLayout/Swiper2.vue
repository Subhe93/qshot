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
    <Swiper
      :modules="[SwiperScrollbar, SwiperGrid]"
      :loop="false"
      :scrollbar="{
        hide: true,
      }"
      :grid="{
        rows: 2,
        fill: 'row',
      }"
      :breakpoints="{
        '200': {
          slidesPerView: 1.1,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 1.3,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 1.4,
          spaceBetween: 20,
        },
      }"
    >
      <SwiperSlide class="swiper2grid" v-for="item in props.items" :key="item">
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
              class="flex-auto w-100 p-4 flex flex-col justify-between leading-normal"
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
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<style>
/* .swiper2grid .swiper-grid-column > .swiper-wrapper {
  flex-wrap: wrap;
  flex-direction: initial !important;
} */
</style>
