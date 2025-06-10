// api/index.js (for Vercel serverless function)

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const channel = req.query.ch || '';
  const id = req.query.id || '';
  let url = req.query.url || '';

  // Validate parameters
  if (!url && (!channel || !id)) {
    return res.status(400).send('Missing parameters');
  }

  try {
    if (!url) {
      url = `https://allinoneerborn.com/sony-live/index.php?ch=${channel}&id=${id}`;
      
      // Fetch headers only, like curl with header + no redirect
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok && response.status !== 302 && response.status !== 301) {
        return res.status(500).send('Failed to get stream redirect');
      }

      const location = response.headers.get('location');
      if (!location) {
        return res.status(500).send('Failed to get stream redirect');
      }
      url = location;
    }

    // Get base url for relative paths
    const baseUrl = new URL(url);
    baseUrl.pathname = baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);

    // Fetch actual content
    const contentResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!contentResponse.ok) {
      return res.status(500).send('Failed to fetch content');
    }

    let content = await contentResponse.text();

    // Detect if content contains "#EXT-X-STREAM-INF" (is_master)
    const isMaster = content.includes('#EXT-X-STREAM-INF');

    const scriptName = 'index.js'; // change as needed for your setup

    // Proxy rewrite logic for URLs in the playlist content
    if (isMaster) {
      // Replace master playlist URIs with proxied URLs
      content = content.replace(
        /^(?!#)(.*master_.*?\.m3u8.*)$/gm,
        (match, p1) => {
          const full = new URL(p1.trim(), baseUrl).href;
          return `${scriptName}?url=${encodeURIComponent(full)}`;
        }
      );
    } else {
      // Replace media segment URIs in media playlist
      content = content.replace(
        /^(?!#)(.+\.ts.*)$/gm,
        (match, p1) => {
          const fullBase = baseUrl.href;
          return `ts.php?base=${encodeURIComponent(fullBase)}&file=${encodeURIComponent(p1.trim())}`;
        }
      );
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.status(200).send(content);

  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
}
