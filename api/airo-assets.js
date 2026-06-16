import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default function handler(req, res) {
  try {
    let key = req.query?.key;

    if (!key && req.url) {
      try {
        const parsedUrl = new URL(req.url, 'http://localhost');
        key = parsedUrl.searchParams.get('key');
        if (!key) {
          let pathname = parsedUrl.pathname;
          key = pathname.replace(/^\/(api\/)?airo-assets\//, '');
          console.log(key);
        }
      } catch (e) {
        key = req.url.replace(/^\/(api\/)?airo-assets\//, '').split('?')[0];
      }
    }

    if (!key) {
      return res.status(400).send('Missing key parameter');
    }

    key = key.replace(/^images\/|^videos\//, '');

    const manifest = require('../airo-media.json');
    console.log('Menifest', manifest);
    const entry = manifest[key];
    console.log('Entry', entry);
    if (entry?.currentUrl) {
      return res.redirect(302, entry.currentUrl);
    }

    return res.status(404).send('Asset not found');
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}
