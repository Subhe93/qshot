// server/api/videos.ts

import { defineEventHandler, readBody } from 'h3';
import { createError } from 'h3';
import { parseStringPromise,Parser } from 'xml2js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, posts_count } = body;

  let feedUrl = url;

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch video feed');
    }

      const data = await response.text();

      let result;
        if (url.includes('youtube.com')) {
    result = await parseStringPromise(data);
      }
      if (url.includes('vimeo.com')) {
       result = await parseStringPromise(data , { mergeAttrs: true });
    }

    // const result = await parseStringPromise(data);

    let items;

    if (url.includes('youtube.com')) {
      items = result.feed.entry;
    } else if (url.includes('vimeo.com')) {
      items = result.rss.channel[0].item;
    }

    const videos = items.slice(0, posts_count).map((item) => {
      if (url.includes('youtube.com')) {
        return {
          title: item.title[0],
          link: item.link[0].$.href,
          description: item['media:group'][0]['media:description'][0],
          pubDate: item.published[0],
          thumbnail: item['media:group'][0]['media:thumbnail'][0].$.url,
        };
      } else if (url.includes('vimeo.com')) {
        return {
          title: item.title[0],
          link: item.link[0],
          description: item.description[0],
          pubDate: '',
          thumbnail: item['media:content'][0]['media:thumbnail'][0]['url'][0],
        };
      }
    });

    return {  videos };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
