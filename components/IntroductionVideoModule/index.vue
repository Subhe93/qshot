<script setup lang="ts">
import { ref } from 'vue';

const { ImageServer } = useAppConfig();
interface Props {
  module: any;
}

const props = defineProps<Props>();

const videoPlayer = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);

function playVideo() {
  if (videoPlayer.value) {
    videoPlayer.value.play();
  }
}

function onPlay() {
  isPlaying.value = true;
}

function onPause() {
  isPlaying.value = false;
}
</script>
<template>
  <div class="relative ">
    <video
      ref="videoPlayer"
      class="w-full rounded-2xl"
      :controls="isPlaying"
      :poster="ImageServer + props.module.thumbnail_url"
      @play="onPlay"
      @pause="onPause"
    >
      <source :src="ImageServer + props.module.url" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div
      v-if="!isPlaying"
      class="absolute inset-0 flex items-center justify-center"
      @click="playVideo"
    >
            <component
              :is="'SvgoPlay'"
              class="social-item absolute inset-x-0 center-abs size-16 place-content-center p-2 rounded-md transition-all duration-300 hover:text-main cursor-pointer"
              :font-controlled="false"
              alt="play"
              aria-label="play"
            />
    </div>
  </div>
</template>
