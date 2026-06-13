import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const password = req.body?.password;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      return res.status(200).json({ success: true, token: adminPassword });
    }

    return res.status(401).json({ success: false, error: "Incorrect developer password." });
  } catch (err: any) {
    console.error("[API] Login error:", err.message);
    return res.status(500).json({ success: false, error: "Internal server error." });
  }
}
