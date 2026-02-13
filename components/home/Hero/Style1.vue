<script setup lang="ts">
import { computed } from 'vue';
import { getCoverPhotoAspectRatio, getProfilePicturePosition, numberToHexText } from '~/composables/useHeroHelpers';

const props = defineProps<{
  profile: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  imageServer: string;
  textColor: number | null;
}>();

const coverPhoto = computed(() => props.settings?.cover_photo as Record<string, unknown> | undefined);
const profilePicture = computed(() => props.settings?.profile_picture as Record<string, unknown> | undefined);
const nameSettings = computed(() => props.settings?.name as Record<string, unknown> | undefined);
const bioSettings = computed(() => props.settings?.bio as Record<string, unknown> | string | undefined);

const defaultColor = computed(() => props.textColor ?? 16777215);

const coverPhotoForAspect = computed(() => coverPhoto.value ?? null);
const profilePictureImage = computed(() => {
  const pp = profilePicture.value;
  const logo = props.settings?.logo as Record<string, string> | undefined;
  if (pp?.image_url) return props.imageServer + String(pp.image_url);
  if (logo?.image_url) return props.imageServer + logo.image_url;
  return '/person.svg';
});
const profilePictureShape = computed((): 'circle' | 'square' | 'rectangle' => {
  const s = profilePicture.value?.shape;
  return s === 'square' || s === 'rectangle' ? s : 'circle';
});
const profilePicturePositionCover = computed(() =>
  getProfilePicturePosition(coverPhotoForAspect.value, (profilePicture.value?.alignment as string) ?? undefined)
);
const profilePicturePositionNoCover = computed(() =>
  getProfilePicturePosition(null, (profilePicture.value?.alignment as string) ?? undefined)
);
const profilePictureBorder = computed(() => {
  const pp = profilePicture.value;
  if (!pp?.border_width) return undefined;
  const color = pp.border_color != null ? numberToHexText(Number(pp.border_color)) : 'transparent';
  return `${pp.border_width}px solid ${color}`;
});
const nameColorRgb = computed(() =>
  numberToHexText(Number(nameSettings.value?.color != null ? nameSettings.value.color : defaultColor.value))
);
const bioColorRgb = computed(() => {
  const bio = bioSettings.value;
  const color = typeof bio === 'object' && bio?.color != null ? bio.color : defaultColor.value;
  return numberToHexText(Number(color));
});
const bioHtml = computed(() => {
  const bio = bioSettings.value;
  const text = typeof bio === 'string' ? bio : (bio as Record<string, unknown>)?.text ?? '';
  return String(text).replace(/\n/g, '<br />');
});
</script>

<template>
  <!-- Cover Photo -->
  <div
    v-if="coverPhoto?.hide !== true"
    class="w-full z-0 relative"
    :style="`
      ${getCoverPhotoAspectRatio(coverPhotoForAspect)}
      ${(!coverPhoto?.shape || coverPhoto?.shape === 'horizontal' || (!coverPhoto?.shape && coverPhoto?.size === 'horizontal')) ? 'margin-bottom: clamp(4rem, 3vw, 2rem);' : ''}
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

    <!-- Profile Picture -->
    <div
      v-if="profilePicture?.hide !== true && (profilePicture?.image_url || settings?.logo?.image_url)"
      class="inline-block"
      :class="{
        'rounded-full': profilePictureShape === 'circle',
        'rounded-lg': profilePictureShape === 'rectangle' || profilePictureShape === 'square'
      }"
      :style="{ ...profilePicturePositionCover, border: profilePictureBorder }"
    >
      <HomeProfilePicture
        :image="profilePictureImage"
        :shape="profilePictureShape"
      />
    </div>
  </div>

  <!-- Cover hidden: keep aspect ratio, optional profile picture -->
  <div
    v-else
    class="w-full z-0 relative"
    style="aspect-ratio: 22 / 9; margin-bottom: clamp(4rem, 3vw, 2rem);"
  >
    <div
      v-if="profilePicture?.hide !== true && (profilePicture?.image_url || settings?.logo?.image_url)"
      class="inline-block absolute"
      :class="{
        'rounded-full': profilePictureShape === 'circle',
        'rounded-lg': profilePictureShape === 'rectangle' || profilePictureShape === 'square'
      }"
      :style="{ ...profilePicturePositionNoCover, border: profilePictureBorder }"
    >
      <HomeProfilePicture
        :image="profilePictureImage"
        :shape="profilePictureShape"
      />
    </div>
  </div>

  <!-- Name and Bio -->
  <div class="pl-5 pr-5">
    <h1
      v-if="nameSettings?.hide !== true && nameSettings?.text"
      class="name_text text-6xl pt-4"
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
        class="h-4 w-4 verified"
        src="/verified_badge.svg"
      />
    </h1>
    <h2
      v-if="(typeof bioSettings === 'string' ? bioSettings : bioSettings?.text) && (typeof bioSettings !== 'object' || bioSettings?.hide !== true)"
      class="bio_text text-2xl text-center pr-4 pl-4 pt-4"
      :style="`color: ${bioColorRgb} !important;`"
    >
      <span v-html="bioHtml" />
    </h2>
  </div>
</template>

<style scoped>
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
