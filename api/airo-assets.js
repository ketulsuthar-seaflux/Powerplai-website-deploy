const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    let { key } = req.query;

    if (!key) {
      return res.status(400).send('Missing key parameter');
    }

    if (key.startsWith('images/')) {
      key = key.replace(/^images\//, '');
    }

    if (key.startsWith('videos/')) {
      key = key.replace(/^videos\//, '');
    }

    const manifestPath = path.resolve(process.cwd(), 'airo-media.json');

    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

      if (manifest[key] && manifest[key].currentUrl) {
        return res.redirect(302, manifest[key].currentUrl);
      }
    }

    return res.status(404).send('Asset not found');
  } catch (err) {
    return res.status(500).send(err.message);
  }
};