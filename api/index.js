import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const channel = req.query.ch || '';
    const id = req.query.id || '';
    let url = req.query.url || '';

    if (!url && (!channel || !id)) {
      return res.status(400).send('Missing parameters');
    }

    if (!url) {
      url = `https://allinoneerborn.com/sony-live/index.php?ch=${channel}&id=${id}`;

      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      if (!response.ok && response.status !== 302 && response.status !== 301) {
        return res.status(500).send(`Failed to get stream redirect, status: ${response.status}`);
      }

      const location = response.headers.get('location');
      if (!location) {
        return res.status(500).send('Failed to get stream redirect: missing location header');
      }
      url = location;
    }

    const baseUrl = new URL(url);
    baseUrl.pathname = baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);

    const contentResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!contentResponse.ok) {
      return res.status(500).send(`Failed to fetch content, status: ${contentResponse.status}`);
    }

    let content = await contentResponse.text();

    const isMaster = content.includes('#EXT-X-STREAM-INF');
    const scriptName = 'api/index'; // adjust if needed

    if (isMaster) {
      content = content.replace(
        /^(?!#)(.*master_.*?\.m3u8.*)$/gm,
        (match, p1) => {
          const full = new URL(p1.trim(), baseUrl).href;
          return `${scriptName}?url=${encodeURIComponent(full)}`;
        }
      );
    } else {
      content = content.replace(
        /^(?!#)(.+\.ts.*)$/gm,
        (match, p1) => {
          return `api/ts?base=${encodeURIComponent(baseUrl.href)}&file=${encodeURIComponent(p1.trim())}`;
        }
      );
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.status(200).send(content);

  } catch (error) {
    console.error('Error in api/index:', error);
    res.status(500).send('Server error: ' + error.message);
  }
}
