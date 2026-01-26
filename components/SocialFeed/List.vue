<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Props {
  info: {
    link: string;
    channel_id: string;
  };
  posts_count: number;
  configuration: string;
  moduleType: String;
}

const props = defineProps<Props>();
const videos = ref(null);
const error = ref(null);
let urlData: string;

async function getVideos() {
  if (props.configuration === "youtube") {
    urlData =
      "https://www.youtube.com/feeds/videos.xml?channel_id=" +
      props.info.channel_id;
  }
  if (props.configuration === "vimeo") {
    urlData = props.info.link + "/videos/rss";
  }
  try {
    const response = await $fetch("/api/videos", {
      method: "POST",
      body: {
        url: urlData,
        posts_count: props.posts_count,
      },
    });

    videos.value = response.videos;
  } catch (fetchError) {
    error.value = "Error fetching videos";
  }
}

onMounted(() => {
  getVideos();
});
</script>
<template>
  <div class="my-4 w-100">
    <div class="swiper2grid pb-4" v-for="item in videos" :key="item">
      <NuxtLink
        v-track-click="{ moduleType: moduleType, moduleName: item.title }"
        target="_blank"
        class="flex items-center justify-left"
        :to="item.link"
      >
        <div class="flex w-full rounded-l-2xl rounded-r-2xl overflow-hidden">
          <div class="w-full object-cover flex-none text-center relative">
            <!-- <NuxtImg
              loading="lazy"
              width="96"
              v-blur-on-load
              :src="
                'https://i.ytimg.com/vi/' + getId(item.url) + '/hqdefault.jpg'
              "
              class="w-full h-full object-cover rounded-md border-gray-800/30 object-cover relative"
              alt="image youtube"
            /> -->
            <NuxtImg
              loading="lazy"
              width="96"
              v-blur-on-load
              :src="item.thumbnail"
              class="w-full h-full object-cover rounded-md border-gray-800/30 object-cover relative"
              alt="image youtube"
            />
            <div class="news-ticker">
              <span class="news-text">{{ item.title }}</span>
            </div>
            <component
              :is="'SvgoPlay'"
              class="social-item absolute inset-x-0 center-abs size-28 place-content-center p-2 rounded-md transition-all duration-300 hover:text-main"
              :font-controlled="false"
              alt="play"
              aria-label="play"
            />
          </div>
        </div>
      </NuxtLink>
    </div>
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
