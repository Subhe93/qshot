<template>
  <div>
    <div id="dynamic-content" class="rounded-2xl overflow-hidden" v-html="htmlContent"></div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  module: Array;
  subdomainName: any;
}

const props = defineProps<Props>();

import { ref, onMounted } from "vue";

const htmlContent = ref("");

function extractScripts(html) {
  const scriptRegex = /<script.*?src="(.*?)".*?<\/script>/g;
  let match;
  const scripts = [];

  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }

  loadScripts(scripts);

  return html.replace(scriptRegex, "");
}

function loadScripts(scripts) {
  scripts.forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  });
}

onMounted(async () => {
  try {
    htmlContent.value = props.module.data.html;

    extractScripts(props.module.data.html);
  } catch (error) {
    console.error("Failed to load content:", error);
  }
});
</script>

<style>
#dynamic-content{
  background: white;
}
</style>
