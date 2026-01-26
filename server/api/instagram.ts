
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const username = query.name;

  if (!username) {
    return {
      status: 400,
      message: "Username is required.",
    };
  }

  try {
    const response = await $fetch(`https://qshot.radiolingo.app/q-profile/instagram-feed/index?name=${username}`, {
      method: "GET",
      headers: {
          "Accept": "application/json",
          "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjJhNGY5ZWJiYjM2MDAxOTYwMzllNTciLCJ1dWlkIjoiY2FlOGE2YTMtNTRhYi00NjZlLWEwMmQtMzdjMWFhYmI3YjYxIiwiaWF0IjoxNzI4OTg5MzA0LCJleHAiOjM2MjI0NDUzMDR9.r_YzPqavKIbVnJUCQp7lDuNIpzwpdt3p5YVsHHtpviQ"
      },
    });

    return response;
  } catch (error) {
    return {
      status: 500,
      message: "Failed to fetch data from Instagram feed.",
      error,
    };
  }
});
