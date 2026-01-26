<script setup lang="ts">
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const props = defineProps<{
  content: string;
}>();

const htmlContent = computed(() => {
  let delta;
  try {
    delta = JSON.parse(props.content);
  } catch (e) {
    console.error("Invalid Delta JSON:", e);
    return "";
  }

  const converter = new QuillDeltaToHtmlConverter(delta, {
    inlineStyles: true,
    paragraphTag: "p",
  });

  return converter.convert();
});
</script>

<template>
  <div class="base-rich-text" v-html="htmlContent" />
</template>
