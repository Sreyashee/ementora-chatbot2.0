const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

// ⚠️ WARNING: don't expose real keys in production!
const API_KEY = "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";  

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  const loading = addMessage("bot", "Typing...");

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ]
      })
    });

    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();
    loading.textContent = data.choices[0].message.content;
  } catch (err) {
    loading.textContent = `⚠️ Error: ${err.message}`;
  }
});
