<template>
  <div class="avatar-container">
    <!-- Canvas element for drawing the gradient border -->
    <canvas ref="canvas" class="avatar-canvas"></canvas>

    <!-- Image element for the avatar -->
    <NuxtImg v-blur-on-load :src="src" alt="Avatar" class="avatar-image" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

// Receive the image source as a prop
defineProps({
  src: {
    type: String,
    required: true,
  },
});

// Reference to the canvas element
const canvas = ref<HTMLCanvasElement | null>(null);

// Draw the gradient border on the canvas
onMounted(() => {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  const canvasSize = 70;
  canvas.value.width = canvasSize;
  canvas.value.height = canvasSize;

  // Create the gradient colors
  const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  gradient.addColorStop(0, "#feda75"); // Yellow
  gradient.addColorStop(0.25, "#fa7e1e"); // Orange
  gradient.addColorStop(0.5, "#d62976"); // Pink
  gradient.addColorStop(0.75, "#962fbf"); // Purple
  gradient.addColorStop(1, "#4f5bd5"); // Blue

  // Draw the circular gradient border
  const lineWidth = 3; // Border thickness
  ctx.beginPath();
  ctx.arc(
    canvasSize / 2, // Center x
    canvasSize / 2, // Center y
    canvasSize / 2 - lineWidth / 2, // Radius
    0, // Start angle
    Math.PI * 2 // End angle (full circle)
  );
  ctx.closePath();

  // Apply the gradient as the border
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = gradient;
  ctx.stroke();
});
</script>

<style scoped>
/* Container for the avatar (image + border) */
.avatar-container {
  position: relative;
  width: 66px;
  height: 66px;
}

/* Canvas for the gradient border */
.avatar-canvas {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 76px;
  height: 76px;
}

/* Avatar image styling */
.avatar-image {
  border: 1px solid transparent;
  border-radius: 50%; /* Make the image circular */
  position: relative;
  z-index: 1; /* Place the image above the canvas */
  object-fit: cover; /* Ensure the image fits correctly */
}
</style>
