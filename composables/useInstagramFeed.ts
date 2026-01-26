export async function useInstagramFeed(username: string) {
  const { data, error } = await useFetch(
      `https://qshot.radiolingo.app/q-profile/instagram-feed/index?name=${username}`, {
           method: "GET",
    headers: {
        "Accept": "application/json",
        "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjJhNGY5ZWJiYjM2MDAxOTYwMzllNTciLCJ1dWlkIjoiY2FlOGE2YTMtNTRhYi00NjZlLWEwMmQtMzdjMWFhYmI3YjYxIiwiaWF0IjoxNzI4OTg5MzA0LCJleHAiOjM2MjI0NDUzMDR9.r_YzPqavKIbVnJUCQp7lDuNIpzwpdt3p5YVsHHtpviQ"
    },
    }
  )
  return { data, error }
}
