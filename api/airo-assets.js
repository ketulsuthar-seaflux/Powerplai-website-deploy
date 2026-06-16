const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    let key = req.url.replace(/^\/airo-assets\//, '');

    if (!key) {
      return res.status(400).send('Missing key parameter');
    }

    key = key.replace(/^images\/|^videos\//, '');

    const manifest = require('../airo-media.json'); // ✅ no fs

    const entry = manifest[key];

    if (entry?.currentUrl) {
      return res.redirect(302, entry.currentUrl);
    }

    return res.status(404).send('Asset not found');

  } catch (err) {
    console.error(err); // IMPORTANT for Vercel logs
    return res.status(500).send(err.message);
  }
};