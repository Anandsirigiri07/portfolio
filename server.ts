import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Load .env.local if present, then load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required for AI features.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

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

// GET configuration status of Gemini API Key
app.get("/api/config", (req, res) => {
  return res.json({ configured: !!process.env.GEMINI_API_KEY });
});

// POST update configuration status of Gemini API Key
app.post("/api/config", async (req, res) => {
  const { geminiApiKey } = req.body;
  try {
    if (!geminiApiKey || !geminiApiKey.trim()) {
      return res.status(400).json({ error: "Gemini API Key is required" });
    }

    const envPath = path.resolve(process.cwd(), ".env.local");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    // Replace existing key or append
    if (envContent.includes("GEMINI_API_KEY=")) {
      envContent = envContent.replace(/GEMINI_API_KEY\s*=\s*.*/, `GEMINI_API_KEY="${geminiApiKey.trim()}"`);
    } else {
      envContent = envContent.trim() + `\nGEMINI_API_KEY="${geminiApiKey.trim()}"\n`;
    }

    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf-8");

    // Update process.env and reset aiInstance
    process.env.GEMINI_API_KEY = geminiApiKey.trim();
    aiInstance = null;

    return res.json({ success: true, message: "Gemini API Key saved successfully to .env.local" });
  } catch (err: any) {
    console.error("Error saving config:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

function getMockChatReply(message: string, profile: any): string {
  const query = message.toLowerCase();
  
  if (query.includes("gssoc") || query.includes("girlscript") || query.includes("open-source") || query.includes("contribution")) {
    return `Anand is an active open-source contributor in **GirlScript Summer of Code (GSSoC)**. He is passionate about contributing to public repositories, refining user interfaces, and collaborating on web development initiatives using HTML, CSS, and JavaScript. This experience is helping him learn collaborative software development workflow and Git/GitHub best practices.`;
  }
  
  if (query.includes("dsa") || query.includes("java") || query.includes("data structure") || query.includes("algorithm")) {
    return `Anand is focusing heavily on mastering **Java** and **Data Structures & Algorithms (DSA)**. He is currently practice-solving coding problems on platforms like LeetCode (his username is **${profile.leetcode || "Anand_sirigiri07"}**) to build a strong theoretical and practical foundation in algorithm design, complexity analysis, and problem-solving techniques.`;
  }
  
  if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("reach") || query.includes("call")) {
    return `You can reach Anand directly via email at **${profile.email}** or by phone at **${profile.phone}**. You can also connect with him on his LinkedIn profile: ${profile.linkedin} or view his code repositories on [GitHub](https://github.com/${profile.github}).`;
  }
  
  if (query.includes("hire") || query.includes("why should") || query.includes("position") || query.includes("job") || query.includes("intern") || query.includes("recruit")) {
    return `You should hire Anand because he is a highly proactive B.Tech undergraduate in **Computer Science and Information Technology (CSIT)** at **REVA University**. He has demonstrated initiative by contributing to **GSSoC**, participating in prompt engineering challenges like **Hack2Skill Prompt War**, and consistently leveling up his programming skills in Java. He is a fast learner, enthusiastic about technology, and brings high energy and dedication to any internship or entry-level software engineering team.`;
  }

  if (query.includes("achievement") || query.includes("hackathon") || query.includes("prompt")) {
    return `Anand's key achievements include:\n1. **GSSoC Contributor**: Contributed to open-source software repositories, learning version control and collaboration.\n2. **Hack2Skill Prompt War Contributor**: Participated in Generative AI Prompt Engineering, showcasing his interest in prompt logic and LLMs.\n3. **Active DSA Learner**: Currently strengthening core coding capabilities via daily practice.`;
  }

  return `Thanks for asking! I'm Anand's AI Assistant. Currently, I am running in local fallback mode. I can answer specific questions about:\n- Anand's **GSSoC** open-source contributions\n- His **Java & DSA** learning progress\n- His **contact details** and social links\n- **Why you should hire** him\n\nWhat would you like to know more about?`;
}

// Recruiter AI Assistant Chatbot API Route
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;

  // Default info about Sirigiri if not fully provided in userProfile
  const fallbackProfile = {
    name: "Sirigiri Anand Kumar",
    university: "REVA University",
    degree: "B.Tech",
    branch: "Computer Science and Information Technology (CSIT)",
    status: "Undergraduate Student (Year 2), GSSoC Contributor, Hack2Skill Prompt War Contributor, active DSA in Java learner",
    email: "anandsirigiri2006@gmail.com",
    phone: "8618636854",
    skills: ["C Programming", "Java Basics", "Data Structures & Algorithms (Beginner)"],
    leetcode: "https://leetcode.com/u/Anand_sirigiri07/",
    github: "Anandsirigiri07",
    linkedin: "https://www.linkedin.com/in/anand-sirigiri-a91910368/",
    hack2skill: "Anandsirigiri07",
    statsOverrides: {},
  };

  const profile = userProfile ? { ...fallbackProfile, ...userProfile } : fallbackProfile;
  const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello!";

  try {
    const key = process.env.GEMINI_API_KEY;
    const isMockKey = !key || key === "AIzaSy_MockKeyForVerification123";

    if (isMockKey) {
      console.log("Using local mock chat assistant fallback (mock/missing key).");
      const reply = getMockChatReply(lastUserMessage, profile);
      return res.json({ reply });
    }

    const ai = getGeminiClient();

    // Build historical chat context or construct a highly customized prompt
    const systemInstruction = `
      You are the official visual recruiter assistant representing Sirigiri Anand Kumar.
      Your goal is to answer questions about Anand's professional, academic, and personal traits in a confident, professional, and friendly tone.
      
      Anand's Details:
      - Name: ${profile.name}
      - University: ${profile.university}
      - Degree: ${profile.degree} in ${profile.branch}
      - Current Role/Focus: ${profile.status}
      - Programming Skills & Languages: ${JSON.stringify(profile.skills)}
      - Real-Time Stats (GitHub, LeetCode, Hack2Skill metrics or overrides): ${JSON.stringify(profile.statsOverrides)}
      - Key Achievements:
         * GSSoC Contributor (GirlScript Summer of Code) - actively contributing to open-source.
         * Hack2Skill Prompt War Contributor - passionate about Generative AI Prompt Engineering.
         * Actively learning Java, Data Structures, and Algorithms (DSA) to build a solid foundational skillset.
      - Contact: Email: ${profile.email} | Phone: ${profile.phone}
      - Profiles: GitHub (${profile.github}), LinkedIn (${profile.linkedin}), LeetCode (${profile.leetcode}), Hack2Skill (${profile.hack2skill})

      Guidelines for replies:
      1. Speak in first person as Anand's professional helper: "Anand is an undergraduate CSIT student at REVA University..." or "Anand has solid experience with..."
      2. Since Anand is in his initial phase (undergraduate, beginner in DSA, GSSoC contributor, C/Java basics), be honest. Do NOT make up fake senior projects or jobs. Showcase his enthusiasm, rapid learning, open source contribution, and prompt engineering interests.
      3. Encourage the recruiter to check out his Interactive B.Tech Growth Roadmap and Recruiters Dashboard on this screen!
      4. Keep answers concise, highly structured, and conversational.
    `;

    // Process user prompt with Gemini 3.5 Flash
    // We send the current message list or compose a structured prompt representing the chat
    const recentMessages = messages ? messages.slice(-5) : [];
    const promptContext = recentMessages.map((m: any) => `${m.sender === "user" ? "Recruiter" : "Assistant"}: ${m.content}`).join("\n") + "\nRecruiter: " + lastUserMessage;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Anand's assistant is temporarily offline, but you can explore his digital timeline below!";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini assistant error, falling back to mock reply:", error.message);
    const reply = getMockChatReply(lastUserMessage, profile);
    res.json({ reply });
  }
});

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
