const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");

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
    // Call your backend API, not OpenRouter directly
    const res = await fetch("https://ementora-chatbot2-0.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    loading.textContent = data.reply;
  } catch (err) {
    loading.textContent = `⚠️ Error: ${err.message}`;
  }
});

