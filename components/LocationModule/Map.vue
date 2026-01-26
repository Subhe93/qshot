<template>
  <div>
    <h3 class="text-2xl">{{ module.title }}</h3>
    <div class="p-4 pl-0 pr-0 rounded-l-2xl">
      <div
        class="p-4 rounded-2xl overflow-hidden"
        style="background-color: #ffffff19; backdrop-filter: blur(4px)"
      >
        <div class="text-l font-bold">
          {{ result.name }}
        </div>
        <div class="text-l">
          {{ result.formatted_address }}
        </div>
        <div v-if="result.rating" class="rating flex flex-nowrap gap-2">
          <div class="text-l font-bold">
            {{ result.rating?.toFixed(1) }}
          </div>
          <div>
            <ClientOnly>
              <star-rating
                :show-rating="false"
                :star-size="20"
                :increment="0.5"
                :round-start-rating="true"
                :rounded-corners="true"
                :border-width="0.1"
                :rating="result.rating"
              ></star-rating>
            </ClientOnly>
          </div>
          <div class="text-l">
            <a
              :href="result.url"
              target="_blank"
              style="color: #458aff; text-decoration: underline"
            >
              {{ result.user_ratings_total }} Reviews</a
            >
          </div>
        </div>
      </div>
      <div class="map mt-4 rounded-lg overflow-hidden">
        <ClientOnly>
          <GoogleMap
            api-key="AIzaSyAbrKSMsgjHjMOsrBxM_NXlCUlsBKQLoYQ"
            style="width: 100%; height: 500px"
            :center="result.geometry.location"
            :zoom="15"
          >
            <Marker :options="{ position: result.geometry.location }" />
          </GoogleMap>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from "vue-star-rating";
import { GoogleMap, Marker } from "vue3-google-map";
interface Props {
  module: {
    title: string;
    value: {
      name: string;
      formatted_address: string;
      place_id: string;
    };
  };
}

const props = defineProps<Props>();

// Fetch data from the API
const { data, error } = await useFetch(
  `https://qshot.radiolingo.app/q-profile/google-map/details`,
  {
    params: { place_id: props.module?.value?.place_id },
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjJhNGY5ZWJiYjM2MDAxOTYwMzllNTciLCJ1dWlkIjoiY2FlOGE2YTMtNTRhYi00NjZlLWEwMmQtMzdjMWFhYmI3YjYxIiwiaWF0IjoxNzI4OTg5MzA0LCJleHAiOjM2MjI0NDUzMDR9.r_YzPqavKIbVnJUCQp7lDuNIpzwpdt3p5YVsHHtpviQ",
    },
  }
);
console.log(data?.value?.data?.result.result);
const result = data?.value?.data?.result.result;
console.log(result.name);
console.log(result.formatted_address);
console.log(result.rating);
console.log(result.user_ratings_total);
console.log(result.geometry.location);
</script>
<style>
.rating svg {
  vertical-align: baseline !important;
}
</style>
