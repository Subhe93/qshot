<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  items: Array<{
    url: string;
    title: string;
    price: string;
    price_after_discount: string;
    thumbnail_url: string;
  }>;
  moduleType: String;
}

const props = defineProps<Props>();

function getId(url: string): string | null {
  let videoId: string | null = null;

  if (url.includes("v=")) {
    const params = new URLSearchParams(url.split("?")[1]);
    videoId = params.get("v");
  } else if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    videoId = parts[1] ? parts[1].substring(0, 11) : null;
  } else if (url.includes("embed/")) {
    const parts = url.split("embed/");
    videoId = parts[1] ? parts[1].substring(0, 11) : null;
  }

  return videoId;
}

async function getVideoD(videoUrl: string): Promise<string | null> {
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    videoUrl
  )}&format=json`;

  try {
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching the video title:", error);
    return null;
  }
}

onMounted(() => {
  props.items.forEach(async (item) => {
    const data = await fetchVideoTitleOnLoad(item.url);
    item.title = data.title || item.title; // Update the title if available
    item.thumbnail_url = data.thumbnail_url || item.thumbnail_url; // Update the title if available
  });
});

async function fetchVideoTitleOnLoad(url: string): Promise<string | null> {
  try {
    const data = await getVideoD(url);
    if (data) {
      return data;
    } else {
      console.log("Failed to retrieve the video title.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while fetching the video title:", error);
    return null;
  }
}
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
          slidesPerView: 1.1,
          spaceBetween: 20,
        },
        '768': {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 1.4,
          spaceBetween: 20,
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
          <div
            class="flex w-full rounded-l-2xl rounded-r-2xl overflow-hidden relative"
          >
            <div class="w-full object-cover flex-none text-center">
              <!-- <NuxtImg
                loading="lazy"
                width="96"
                v-blur-on-load
                :src="
                  'https://i.ytimg.com/vi/' +
                  getId(item.url) +
                  '/maxresdefault.jpg'
                "
                class="w-full h-full rounded-md border-gray-800/30"
                alt="image youtube"
              /> -->
              <NuxtImg
                loading="lazy"
                width="96"
                v-blur-on-load
                :src="item.thumbnail_url"
                class="w-full h-full rounded-md border-gray-800/30"
                alt="image youtube"
              />
              <div class="news-ticker">
                <span class="news-text">{{ item.title }}</span>
              </div>
              <component
                :is="'SvgoPlay'"
                class="absolute inset-x-0 mx-auto center-abs2 size-24 place-content-center p-2 rounded-md transition-all duration-300 hover:text-main"
                :font-controlled="false"
                alt="play"
                aria-label="play"
              />
            </div>
          </div>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<style scoped>
.news-ticker {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 0;
}

.news-text {
  display: inline-block;
  padding-left: 100%; /* Start off-screen */
  animation: ticker 30s linear infinite; /* Duration of the scroll */
  color: #fff; /* White text color */
  font-weight: bold;
}

@keyframes ticker {
  0% {
    transform: translateX(0%); /* Start from right off-screen */
  }
  50% {
    transform: translateX(-100%); /* End off-screen to the left */
  }
  100% {
    transform: translateX(0); /* Start from right off-screen */
  }
}
</style>
