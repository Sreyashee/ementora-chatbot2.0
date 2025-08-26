import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Put your OpenRouter API key here (keep it secret)
const API_KEY = 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;
console.log("Using API key:", API_KEY ? "✅ Loaded" : "❌ Missing");


app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    // Log full status and response for debugging
    console.log("OpenRouter status:", response.status);

    const data = await response.json();
    console.log("OpenRouter response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch response" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


