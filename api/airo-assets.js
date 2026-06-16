import { createRequire } from "module";
const require = createRequire(import.meta.url);

const manifest = require("../airo-media.json");

export default async function handler(req, res) {
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

    let imageUrl = entry.currentUrl;

    if (variant && entry.reversedUrlMap) {
      if (variant === "reversed") {
        imageUrl = entry.reversedUrlMap?.[imageUrl] || imageUrl;
      } else if (variant === "solid") {
        imageUrl = entry.solidUrlMap?.[imageUrl] || imageUrl;
      } else if (variant === "reversedSolid" || variant === "reversed-solid") {
        imageUrl = entry.reversedSolidUrlMap?.[imageUrl] || imageUrl;
      }
    }
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(404).send("Image fetch failed");
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // set proper headers
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    return res.status(200).send(buffer);

  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
}