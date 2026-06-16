const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      res.status(400).send('Missing key parameter');
      return;
    }

    const manifestPath = path.resolve(process.cwd(), 'airo-media.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      if (manifest[key] && manifest[key].currentUrl) {
        res.writeHead(302, { Location: manifest[key].currentUrl });
        res.end();
        return;
      }
    }
    res.status(404).send('Asset not found');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
