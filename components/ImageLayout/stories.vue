<script setup lang="ts">
import { ref, onMounted } from "vue";

import VueEasyLightbox from "vue-easy-lightbox";
const { ImageServer } = useAppConfig();
interface Props {
  items: Array;
}

const props = defineProps<Props>();

const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

// Generate the image URLs from the items
const imageUrls = props.items.map((item) => ImageServer + item.url);

// Open the lightbox with a specific image index
function openLightbox(index) {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
}
onMounted(() => {
  const childElement = document.querySelector(".child-element");

  if (childElement) {
    document.body.appendChild(childElement);
  } else {
    console.error("Element with class '.child-element' not found.");
  }
});
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
          slidesPerView: 1.8,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 2.4,
          spaceBetween: 20,
        },
      }"
    >
      <SwiperSlide
        v-for="(item, index) in props.items"
        :key="item.url"
        @click="openLightbox(index)"
      >
        <NuxtLink target="_blank" class="flex items-center justify-left">
          <div
            class="flex w-full rounded-l-2xl rounded-r-2xl overflow-hidden relative"
          >
            <div class="w-full aspect-[9/16] rounded-md overflow-hidden border border-gray-800/30">
              <NuxtImg
                loading="lazy"
                width="96"
                v-blur-on-load
                :src="ImageServer + item.url"
                class="w-full h-full object-cover"
                alt="image stories"
              />
            </div>
          </div>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
    <div class="child-element">
      <VueEasyLightbox
        :visible="lightboxVisible"
        :imgs="imageUrls"
        :index="lightboxIndex"
        @hide="lightboxVisible = false"
        :move-disabled="true"
      />
    </div>
  </div>
</template>
