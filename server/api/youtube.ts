// server/api/youtube.ts

import { defineEventHandler, readBody } from 'h3';
import { createError } from 'h3';
import { parseStringPromise } from 'xml2js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { channel_id, posts_count } = body;

  const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`;

  try {
    const response = await fetch(rssFeedUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch RSS feed');
    }

    const data = await response.text();

    const result = await parseStringPromise(data);
    const items = result.feed.entry;

    const videos = items.slice(0, posts_count).map((item) => ({
      title: item.title[0],
      link: item.link[0].$.href,
      description: item['media:group'][0]['media:description'][0],
      pubDate: item.published[0],
    }));

    return { videos };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
