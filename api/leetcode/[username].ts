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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
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
    return res.status(200).json(data);
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
          { difficulty: "Hard", count: 750 },
        ],
        matchedUser: {
          submitStats: {
            acSubmissionNum: [
              { difficulty: "All", count: 0, submissions: 0 },
              { difficulty: "Easy", count: 0, submissions: 0 },
              { difficulty: "Medium", count: 0, submissions: 0 },
              { difficulty: "Hard", count: 0, submissions: 0 },
            ],
          },
          profile: { ranking: 0, reputation: 0, starRating: 0 },
        },
      },
    });
  }
}
