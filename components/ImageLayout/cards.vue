<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

import VueEasyLightbox from "vue-easy-lightbox";
const { ImageServer } = useAppConfig();
interface Props {
  items: Array;
}

const props = defineProps<Props>();

const lightboxVisible = ref(false);
const lightboxIndex = ref(0);
const canvasRefs = ref<(HTMLCanvasElement | null)[]>([]);

// Generate the image URLs from the items
const imageUrls = props.items.map((item) => ImageServer + item.url);

// Open the lightbox with a specific image index
function openLightbox(index) {
  lightboxIndex.value = index;
  lightboxVisible.value = true;
}

// Set canvas ref safely
function setCanvasRef(el: HTMLCanvasElement | null, index: number) {
  if (el) {
    // Ensure array is large enough
    while (canvasRefs.value.length <= index) {
      canvasRefs.value.push(null);
    }
    canvasRefs.value[index] = el;

    // Draw immediately if we have the item data
    if (props.items[index]) {
      const item = props.items[index];
      // Check if item has valid rect data
      if (item.rect && Array.isArray(item.rect) && item.rect.length === 4) {
        drawCroppedImage(el, item, index);
      }
    }
  }
}

// Draw cropped image on canvas
function drawCroppedImage(canvas: HTMLCanvasElement, item: any, index: number) {
  if (
    !canvas ||
    !item.rect ||
    !Array.isArray(item.rect) ||
    item.rect.length !== 4
  ) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const [cropX, cropY, cropWidth, cropHeight] = item.rect;
  const imageUrl = ImageServer + item.url;

  if (cropWidth <= 0 || cropHeight <= 0) {
    return;
  }

  // Note: rect values are in pixels (from Flutter crop_image package cropSize)
  // not normalized percentages (crop)

  const img = new Image();

  img.onload = () => {
    // Get the actual container size
    const containerRect = canvas.getBoundingClientRect();
    const canvasSize =
      Math.min(containerRect.width, containerRect.height) || 300;

    // Set canvas size to match container (square 1:1 ratio)
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Check if crop area is valid and within image bounds
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Ensure crop area doesn't exceed image bounds
    const validCropX = Math.max(0, Math.min(cropX, imgWidth));
    const validCropY = Math.max(0, Math.min(cropY, imgHeight));
    const validCropWidth = Math.min(cropWidth, imgWidth - validCropX);
    const validCropHeight = Math.min(cropHeight, imgHeight - validCropY);

    // If crop area is too small or invalid, use the entire image
    if (
      validCropWidth <= 0 ||
      validCropHeight <= 0 ||
      validCropWidth < 10 ||
      validCropHeight < 10
    ) {
      // Draw entire image to fill canvas (fallback)
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
    } else {
      // Use object-fit: cover logic - fill the entire canvas with the cropped area
      const scaleX = canvasSize / validCropWidth;
      const scaleY = canvasSize / validCropHeight;
      const scale = Math.max(scaleX, scaleY); // Use max to fill completely (cover behavior)

      // Calculate scaled dimensions
      const scaledWidth = validCropWidth * scale;
      const scaledHeight = validCropHeight * scale;

      // Center the scaled image
      const offsetX = (canvasSize - scaledWidth) / 10;
      const offsetY = (canvasSize - scaledHeight) / 10;

      // Draw the cropped portion to fill the entire canvas
      ctx.drawImage(
        img,
        validCropX,
        validCropY,
        validCropWidth,
        validCropHeight, // Source rectangle (crop area)
        offsetX,
        offsetY,
        scaledWidth,
        scaledHeight // Destination rectangle (canvas)
      );
    }
  };

  img.onerror = (error) => {
    console.error("Failed to load image:", imageUrl, error);

    // Get the actual container size for placeholder
    const containerRect = canvas.getBoundingClientRect();
    const canvasSize =
      Math.min(containerRect.width, containerRect.height) || 300;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear canvas and draw a placeholder
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw placeholder text
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${Math.max(12, canvasSize / 20)}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Image not found", canvasSize / 2, canvasSize / 2);
  };

  img.src = imageUrl;
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
          slidesPerView: 1.1,
          spaceBetween: 10,
        },
        '768': {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
        '1024': {
          slidesPerView: 1.8,
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
          <div class="flex w-full rounded-l-2xl rounded-r-2xl overflow-hidden">
            <div
              class="w-full aspect-[1/1] rounded-md overflow-hidden relative border border-gray-800/30"
            >
              <canvas
                v-if="
                  item.rect &&
                  Array.isArray(item.rect) &&
                  item.rect.length === 4
                "
                :ref="(el) => setCanvasRef(el as HTMLCanvasElement, index)"
                class="rounded-md w-full h-full"
                style="display: block"
                v-blur-on-load
                alt="cropped image"
              />
              <NuxtImg
                v-else
                loading="lazy"
                width="96"
                v-blur-on-load
                :src="ImageServer + item.url"
                class="w-full h-full object-cover"
                alt="image swiper"
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
