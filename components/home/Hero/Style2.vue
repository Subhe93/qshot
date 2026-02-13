<script setup lang="ts">
import { computed } from 'vue';
import { getCoverPhotoAspectRatio, numberToHexText } from '~/composables/useHeroHelpers';

const props = defineProps<{
  profile: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  imageServer: string;
  textColor: number | null;
}>();

const coverPhoto = computed(() => props.settings?.cover_photo as Record<string, unknown> | undefined);
const titleSettings = computed(() => props.settings?.title as Record<string, unknown> | undefined);
const textSettings = computed(() => props.settings?.text as Record<string, unknown> | undefined);
const button1Settings = computed(() => props.settings?.button1 as Record<string, unknown> | undefined);
const button2Settings = computed(() => props.settings?.button2 as Record<string, unknown> | undefined);
const nameSettings = computed(() => props.settings?.name as Record<string, unknown> | undefined);
const bioSettings = computed(() => props.settings?.bio as Record<string, unknown> | string | undefined);

const defaultColor = computed(() => props.textColor ?? 16777215);

const coverPhotoForAspect = computed(() => coverPhoto.value ?? null);
const titleColorRgb = computed(() =>
  numberToHexText(Number(titleSettings.value?.color != null ? titleSettings.value.color : defaultColor.value))
);
const textColorRgb = computed(() =>
  numberToHexText(Number(textSettings.value?.color != null ? textSettings.value.color : defaultColor.value))
);
const button1Href = computed(() => {
  const u = button1Settings.value?.url;
  return u && typeof u === 'string' ? u : '#';
});
const button2Href = computed(() => {
  const u = button2Settings.value?.url;
  return u && typeof u === 'string' ? u : '#';
});
const button1Style = computed(() => ({
  backgroundColor: numberToHexText(Number(button1Settings.value?.background_color ?? 0)),
  color: numberToHexText(Number(button1Settings.value?.foreground_color ?? 16777215)),
}));
const button2Style = computed(() => ({
  backgroundColor: numberToHexText(Number(button2Settings.value?.background_color ?? 0)),
  color: numberToHexText(Number(button2Settings.value?.foreground_color ?? 16777215)),
}));
const nameColorRgb = computed(() =>
  numberToHexText(Number(nameSettings.value?.color != null ? nameSettings.value.color : defaultColor.value))
);
const bioColorRgb = computed(() => {
  const bio = bioSettings.value;
  const color = typeof bio === 'object' && bio?.color != null ? (bio as Record<string, unknown>).color : defaultColor.value;
  return numberToHexText(Number(color));
});
const bioHtml = computed(() => {
  const bio = bioSettings.value;
  const text = typeof bio === 'string' ? bio : (bio as Record<string, unknown>)?.text ?? '';
  return String(text).replace(/\n/g, '<br />');
});

const isCoverVertical = computed(() => {
  const s = coverPhoto.value?.shape;
  const sz = coverPhoto.value?.size;
  return s === 'vertical' || (!s && sz === 'vertical');
});
</script>

<template>
  <!-- Cover Photo (no profile picture in style2): aspect ratio 4:5 / 9:16 on mobile; desktop: 50vh for poster, 90vh for vertical -->
  <div
    v-if="coverPhoto?.hide !== true"
    class="style2-cover w-full z-0 relative"
    :class="{ 'style2-cover-vertical': isCoverVertical }"
    :style="`
      ${getCoverPhotoAspectRatio(coverPhotoForAspect)}
      ${(!coverPhoto?.shape || coverPhoto?.shape === 'horizontal' || (!coverPhoto?.shape && coverPhoto?.size === 'horizontal')) ? 'margin-bottom: 0;' : 'margin-bottom: 0;'}
    `"
  >
    <div
      v-if="coverPhoto?.image_url"
      class="absolute inset-0 w-full h-full"
      :style="`
        background-image: url(${imageServer}${coverPhoto.image_url});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: ${coverPhoto.transparency ?? 1};
        ${coverPhoto.fade ? 'mask-image: linear-gradient(to top, transparent 0%, black 15%);' : ''}
        z-index: 0;
      `"
    />
    <div
      v-else
      class="absolute inset-0 w-full h-full bg-transparent"
      style="z-index: 0;"
    />

    <!-- Overlay: title, text, buttons (centered) -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-end gap-3 pb-3 px-4 z-[1]"
    >
      <h1
        v-if="titleSettings?.hide !== true && titleSettings?.text"
        class="name_text text-4xl md:text-5xl font-bold text-center text-white drop-shadow-md"
        :style="`color: ${titleColorRgb} !important;`"
      >
        {{ titleSettings.text }}
      </h1>
      <p
        v-if="textSettings?.hide !== true && textSettings?.text"
        class="text-sm md:text-base text-center max-w-md opacity-90"
        :style="`color: ${textColorRgb} !important;`"
      >
        {{ textSettings.text }}
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 mt-2">
        <a
          v-if="button1Settings?.hide !== true && button1Settings?.text"
          :href="button1Href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
          :style="button1Style"
        >
          {{ button1Settings.text }}
        </a>
        <a
          v-if="button2Settings?.hide !== true && button2Settings?.text"
          :href="button2Href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-medium transition-opacity hover:opacity-90"
          :style="button2Style"
        >
          {{ button2Settings.text }}
        </a>
      </div>
    </div>
  </div>

  <!-- Section below: name + bio (dark background) -->
  <div class="w-full px-5 py-2">
    <h1
      v-if="nameSettings?.hide !== true && nameSettings?.text"
      class="name_text text-4xl md:text-5xl font-bold mb-2"
      :class="{
        'text-center': !nameSettings?.alignment || nameSettings?.alignment === 'center',
        'text-left': nameSettings?.alignment === 'start' || nameSettings?.alignment === 'left',
        'text-right': nameSettings?.alignment === 'end' || nameSettings?.alignment === 'right'
      }"
      :style="`color: ${nameColorRgb} !important;`"
    >
      {{ nameSettings.text }}
      <NuxtImg
        v-if="profile?.verified"
        class="h-4 w-4 verified inline-block align-middle"
        src="/verified_badge.svg"
      />
    </h1>
    <div
      v-if="(typeof bioSettings === 'string' ? bioSettings : bioSettings?.text) && (typeof bioSettings !== 'object' || bioSettings?.hide !== true)"
      class="bio_text text-lg md:text-xl opacity-80"
      :style="`color: ${bioColorRgb} !important;`"
    >
      <span v-html="bioHtml" />
    </div>
  </div>
</template>

<style scoped>
/* على الويب: الغلاف poster 50vh، والغلاف vertical (9:16) حتى 90vh */
@media (min-width: 768px) {
  .style2-cover {
    max-height: 70vh;
  }
  .style2-cover.style2-cover-vertical {
    max-height: 90vh;
  }
}
.bio_text {
  opacity: 0.8;
}
.verified {
  display: inline-block;
  transform: scale(2);
  margin-bottom: 2px;
}
@media (max-width: 991px) {
  .name_text {
    font-size: 24px;
  }
  .bio_text {
    font-size: 16px;
  }
  .verified {
    transform: scale(1.2);
    margin-bottom: 2px;
  }
}
</style>
