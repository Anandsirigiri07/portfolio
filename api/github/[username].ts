import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username parameter is required." });
  }

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

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          "User-Agent": "Sirigiri-Portfolio-App",
        },
      }
    );

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

    return res.status(200).json({
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
}
