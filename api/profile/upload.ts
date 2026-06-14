import { put } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Verify admin authentication
    const token = req.headers["x-admin-token"] as string;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (!token || token !== adminPassword) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { image } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "Image data is required." });
    }

    // Parse the base64 data URI (e.g. "data:image/png;base64,iVBOR...")
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/s);
    if (!matches) {
      return res.status(400).json({ success: false, error: "Invalid image format. Expected base64 data URI." });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Upload to Vercel Blob with a fixed name (overwrites previous profile image)
    const blob = await put("profile-image", buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType,
    });

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error: any) {
    console.error("[API] Profile upload error:", error.message);
    return res.status(500).json({ success: false, error: "Failed to upload profile image." });
  }
}
