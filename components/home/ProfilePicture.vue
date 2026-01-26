<script setup lang="ts">
const img = useImage();
interface Props {
  image: string;
  shape?: 'circle' | 'square' | 'rectangle';
}

const props = defineProps<Props>();
const shape = props.shape || 'circle';

// التحقق من أن الصورة هي person.svg (صورة افتراضية)
const isDefaultImage = computed(() => props.image === '/person.svg' || props.image.endsWith('/person.svg'));
</script>

<template>
  <div class="z-10 flex items-center justify-center">
    <ClientOnly>
      <!-- <SpotlightButton rounded> -->
      <div
        class="font-mona relative flex items-center justify-center gap-2 transition-all duration-200"
        :class="{
          'backdrop-blur-md bg-white/10': isDefaultImage,
          'rounded-full': isDefaultImage && shape === 'circle',
          'rounded-lg': isDefaultImage && (shape === 'square' || shape === 'rectangle'),
          'bg-gradient-to-b from-white/25 to-white bg-clip-text text-lg font-medium text-transparent': !isDefaultImage
        }"
      >
        <NuxtImg
          loading="lazy"
          v-blur-on-load
          :src="props.image"
          id="profile_image"
          ref="profile_image"
          class="object-cover"
          :class="{
            'size-28 md:size-40 rounded-full': shape === 'circle',
            'size-28 md:size-40 rounded-lg': shape === 'square',
            'w-48 md:w-80 aspect-[16/9] rounded-lg': shape === 'rectangle',
            'p-4': isDefaultImage
          }"
          alt="Profile Picture"
          aria-label="Profile Picture"
        />
      </div>
      <!-- </SpotlightButton> -->
    </ClientOnly>
  </div>
</template>
