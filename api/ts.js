// api/ts.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  const base = req.query.base || '';
  const file = req.query.file || '';

  if (!base || !file) {
    return res.status(400).send('Invalid parameters');
  }

  const url = base + file;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.sonyliv.com/',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch file');
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);

    // Stream the response body directly to client
    response.body.pipe(res);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
}
