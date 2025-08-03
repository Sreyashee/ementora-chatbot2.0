const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat");
const authenticate = require("../middleware/authMiddleware");

// POST: Send message and get reply
router.post("/", authenticate, async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant. Always respond in English." },
          { role: "user", content: userMessage }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    await Chat.create({
      userId: req.user.userId,
      messages: [
        { sender: "user", message: userMessage },
        { sender: "bot", message: reply }
      ]
    });

    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from OpenRouter" });
  }
});

// GET: Fetch chat history for the authenticated user
router.get("/history", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId });

    if (!chats.length) return res.json([]);

    const history = chats.flatMap(chat =>
      chat.messages.map(msg => ({
        sender: msg.sender,
        message: msg.message,
        timestamp: msg.timestamp
      }))
    );

    // Optional: sort by timestamp descending
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

module.exports = router;


