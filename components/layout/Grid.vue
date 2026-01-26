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
      :modules="[SwiperFreeMode, SwiperScrollbar]"
      :loop="false"
      :scrollbar="{
        hide: true,
      }"
      :breakpoints="{
        '200': {
          slidesPerView: 2.5,
          spaceBetween: 5,
        },
        '768': {
          slidesPerView: 3,
          spaceBetween: 50,
        },
        '1024': {
          slidesPerView: 4,
          spaceBetween: 5,
        },
      }"
    >
      <SwiperSlide v-for="item in props.items" :key="item">
        <NuxtLink
          v-track-click="{ moduleType: moduleType, moduleName: item.title }"
          target="_blank"
          class="flex items-center justify-left"
          :to="item.url"
        >
          <div class="overflow-hidden grid grid-cols-1">
            <NuxtImg
              loading="lazy"
              width="96"
              v-blur-on-load
              :src="ImageServer + item.thumbnail_url"
              class="size-32 rounded-md border-gray-800/30 object-cover"
              :alt="item.title"
            />
            <div class="pt-2 text-heading-weight">{{ item.title }}</div>
            <div class="">
              {{ item.description }}
            </div>
            <div class="" v-if="item.price">
              {{ item.price }} {{ item.currency }}
              <small
                ><span class="line-through"
                  >{{ item.price_after_discount }} {{ item.currency }}</span
                ></small
              >
            </div>
          </div>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
