const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");
const button = form.querySelector("button");

// Autofocus input
input.focus();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  input.disabled = true;
  button.disabled = true;

  // Loading message
  const loadingMessage = addMessage("bot", "Typing...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error("Failed to connect to server.");
    }

    const data = await res.json();

    // Replace loading message
    loadingMessage.textContent = data.reply;
  } catch (err) {
    loadingMessage.textContent = `Error: ${err.message}`;
  } finally {
    input.disabled = false;
    button.disabled = false;
    input.focus();
  }
});

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div; // return for later editing
}
