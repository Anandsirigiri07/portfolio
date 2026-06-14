import { list } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { blobs } = await list({ prefix: "profile-image" });

    if (blobs.length > 0) {
      const buster = new Date(blobs[0].uploadedAt).getTime();
      return res.status(200).json({ success: true, url: `${blobs[0].url}?t=${buster}` });
    }

    return res.status(200).json({ success: true, url: null });
  } catch (error: any) {
    console.error("[API] Profile get error:", error.message);
    // If Vercel Blob is not configured, return null gracefully
    return res.status(200).json({ success: false, url: null });
  }
}
