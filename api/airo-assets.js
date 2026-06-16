import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default function handler(req, res) {
  try {
    let key = req.query?.key;
    let variant = req.query?.variant;

    if (req.url) {
      try {
        const parsedUrl = new URL(req.url, 'http://localhost');
        if (!key) {
          key = parsedUrl.searchParams.get('key');
          if (!key) {
            let pathname = parsedUrl.pathname;
            key = pathname.replace(/^\/(api\/)?airo-assets\//, '');
          }
        }
        if (!variant) {
          variant = parsedUrl.searchParams.get('variant');
        }
      } catch (e) {
        if (!key) {
          key = req.url.replace(/^\/(api\/)?airo-assets\//, '').split('?')[0];
        }
      }
    }

    if (!key) {
      return res.status(400).send('Missing key parameter');
    }

    key = key.replace(/^images\/|^videos\//, '');

    const manifest = require('../airo-media.json');

    const entry = manifest[key];

    if (!entry) {
      return res.status(404).send('Asset not found');
    }

    let redirectUrl = entry.currentUrl;

    if (variant && redirectUrl) {
      if (variant === 'reversed' && entry.reversedUrlMap?.[redirectUrl]) {
        redirectUrl = entry.reversedUrlMap[redirectUrl];
      } else if (variant === 'solid' && entry.solidUrlMap?.[redirectUrl]) {
        redirectUrl = entry.solidUrlMap[redirectUrl];
      } else if ((variant === 'reversedSolid' || variant === 'reversed-solid') && entry.reversedSolidUrlMap?.[redirectUrl]) {
        redirectUrl = entry.reversedSolidUrlMap[redirectUrl];
      }
    }

    if (redirectUrl) {
      return res.redirect(302, redirectUrl);
    }

    return res.status(404).send('Asset URL not found');

  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}
