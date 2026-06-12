import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

// Load .env.local if present, then load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// REST Proxy for LeetCode to bypass CORS constraints
app.get("/api/leetcode/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const query = `
      query userProblemsSolved($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`LeetCode responding code ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Error fetching LeetCode data:", error.message);
    // Return standard graceful fallback structure so frontend doesn't break
    return res.status(200).json({
      error: true,
      message: error.message,
      data: {
        allQuestionsCount: [
          { difficulty: "All", count: 3300 },
          { difficulty: "Easy", count: 830 },
          { difficulty: "Medium", count: 1720 },
          { difficulty: "Hard", count: 750 }
        ],
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: "All", count: 0, submissions: 0 },
              { difficulty: "Easy", count: 0, submissions: 0 },
              { difficulty: "Medium", count: 0, submissions: 0 },
              { difficulty: "Hard", count: 0, submissions: 0 }
            ]
          },
          profile: { ranking: 0, reputation: 0, starRating: 0 }
        }
      }
    });
  }
});

// REST Proxy for GitHub data to avoid CORS
app.get("/api/github/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "Sirigiri-Portfolio-App",
      },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user response code ${userRes.status}`);
    }

    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        "User-Agent": "Sirigiri-Portfolio-App",
      },
    });

    let starsCount = 0;
    let languages: Record<string, number> = {};
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        for (const r of repos) {
          starsCount += r.stargazers_count || 0;
          if (r.language) {
            languages[r.language] = (languages[r.language] || 0) + 1;
          }
        }
      }
    }

    return res.json({
      success: true,
      avatar_url: userData.avatar_url,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      bio: userData.bio,
      stars: starsCount,
      languages,
    });
  } catch (error: any) {
    console.error("Error fetching GitHub data:", error.message);
    return res.status(200).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
});

// Developer Login verification endpoint
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPassword) {
    return res.json({ success: true, token: adminPassword });
  }
  return res.status(401).json({ success: false, error: "Incorrect developer password." });
});

// Helper validation for admin operations
function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ error: "Unauthorized access: Invalid developer password." });
  }
  next();
}

// Configure Vite integration for asset rendering
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
