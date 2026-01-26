<template>
  <div class="p-4 pl-0 pr-0">
    <!-- Profile Section -->
    <div
      v-if="settings.show_profile_details && profile"
      class="flex flex-col items-center space-x-4 mb-6 w-full"
    >
      <div style="margin: 0 auto" class="flex items-center gap-5">
        <div class="avatar-gradient-border">
          <SocialFeedInstagramAvatarWithGradient
            :src="profile.profile_picture_url"
          ></SocialFeedInstagramAvatarWithGradient>
        </div>
        <div>
          <h3 class="text-2xl">{{ profile.name }}</h3>
          <span class="text-white-new text-base bio_text"
            >@{{ profile.username }}</span
          >
        </div>
      </div>
      <div
        class="flex flex items-center justify-between gap-5 m-auto text-center mt-3 w-full max-w-[220px]"
      >
        <div>
          <div class="text-2xl">{{ profile.media_count }}</div>
          <div class="text-white-new text-base bio_text">Posts</div>
        </div>
        <div>
          <div class="text-2xl">{{ profile.followers_count }}</div>
          <div class="text-white-new text-base bio_text">Followers</div>
        </div>
        <div>
          <div class="text-2xl">{{ profile.follows_count }}</div>
          <div class="text-white-new text-base bio_text">following</div>
        </div>
      </div>
    </div>

    <!-- Posts Section -->
    <div v-if="posts.length" class="grid grid-cols-2 md:grid-cols-3 gap-0">
      <div
        v-for="post in posts.slice(0, props.module.posts_count)"
        :key="post.id"
        class="relative group"
      >
        <NuxtLink
          v-track-click="{
            moduleType: props.module.type,
            moduleName: 'Instagram',
          }"
          :to="post.permalink"
          target="_blank"
          class="block"
        >
          <div v-if="post.media_type === 'IMAGE'">
            <NuxtImg
              v-blur-on-load
              :src="post.media_url"
              alt="Post Thumbnail"
              class="w-full h-40 object-cover"
            />
          </div>
          <div v-if="post.media_type === 'CAROUSEL_ALBUM'">
            <NuxtImg
              v-blur-on-load
              :src="post.media_url"
              alt="Post Thumbnail"
              class="w-full h-40 object-cover"
            />
          </div>
          <div v-if="post.media_type === 'VIDEO'">
            <NuxtImg
              v-blur-on-load
              :src="post.thumbnail_url"
              alt="Post Thumbnail"
              class="w-full h-40 object-cover"
            />
          </div>
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex justify-center gap-5 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p
              class="text-white text-sm flex justify-center items-center gap-1"
            >
              <svg
                aria-label="Like"
                class="x1lliihq x1n2onr6 xyb1xck"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Like</title>
                <path
                  d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
                ></path>
              </svg>
              {{ post.like_count }}
            </p>
            <p
              class="text-white text-sm flex justify-center items-center gap-1"
            >
              <svg
                aria-label="Comment"
                class="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Comment</title>
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
              {{ post.comments_count }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">No posts available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  module: {
    info?: {
      username?: string;
    };
  };
}

const props = defineProps<Props>();

// Fetch data from the API
const { data, error } = await useFetch(`/api/instagram`, {
  params: { name: props.module?.info?.username },
});

// Extract data
const profile = computed(() => data.value?.data?.business_discovery || null);
const posts = computed(() => profile.value?.media?.data || []);

// Show only posts with thumbnails
// const filteredPosts = computed(() =>
//   posts.value.filter((post) => post.thumbnail_url)
// );

const settings = props.module?.settings;
</script>
