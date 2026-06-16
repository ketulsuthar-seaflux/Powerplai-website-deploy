import { createRequire } from "module";
const require = createRequire(import.meta.url);

const manifest = require("../airo-media.json");

export default function handler(req, res) {
  try {
    const parsedUrl = new URL(req.url, "http://localhost");

    let key = req.query?.key || parsedUrl.searchParams.get("key");
    let variant = req.query?.variant || parsedUrl.searchParams.get("variant");

    if (!key) {
      key = parsedUrl.pathname.replace(/^\/(api\/)?airo-assets\//, "");
    }

    if (!key) {
      return res.status(400).send("Missing key parameter");
    }

    key = key.replace(/^images\/|^videos\//, "");

    const entry = manifest[key];

    if (!entry) {
      return res.status(404).send("Asset not found");
    }

    let redirectUrl = entry.currentUrl;

    if (variant && redirectUrl) {
      if (variant === "reversed" && entry.reversedUrlMap?.[redirectUrl]) {
        redirectUrl = entry.reversedUrlMap[redirectUrl];
      } else if (variant === "solid" && entry.solidUrlMap?.[redirectUrl]) {
        redirectUrl = entry.solidUrlMap[redirectUrl];
      } else if (
        (variant === "reversedSolid" || variant === "reversed-solid") &&
        entry.reversedSolidUrlMap?.[redirectUrl]
      ) {
        redirectUrl = entry.reversedSolidUrlMap[redirectUrl];
      }
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.redirect(302, redirectUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}