<template>
  <HeaderDefault :pages_list="pages_list" />
</template>

<script lang="ts" setup>
import HeaderDefault from "~/components/home/Header/Style1.vue";
defineProps({
  pages_list: {
    type: Array as () => Array<{
      id: number;
      urlName: string;
      listName: string;
      order: number;
    }>,
    required: true,
  },
});
</script>

<style scoped>
</style>
