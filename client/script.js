const form = document.getElementById("form");
const input = document.getElementById("input");
const chat = document.getElementById("chat");
const auth = document.getElementById("auth");
const authMsg = document.getElementById("authMessage");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem("token");

if (token) {
  showChat();
} else {
  // Show chat area so message appears
  chat.style.display = "block";

  // Disable chat form elements
  //input.disabled = true;
  //document.getElementById("sendBtn").disabled = true;
  //document.getElementById("logoutBtn").disabled = true;

  // Show login prompt
  addMessage("bot", "🔒 Please login to use the chatbot.");
}

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

  const token = localStorage.getItem("token");

  if (!token) {
    addMessage("bot", "⚠️ Please log in to use the chatbot.");
    return;
  }

  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  input.disabled = true;

  const loadingMessage = addMessage("bot", "Typing...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    loadingMessage.textContent = data.reply;
  } catch (err) {
    loadingMessage.textContent = `Error: ${err.message}`;
  } finally {
    input.disabled = false;
    input.focus();
  }
});


async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) return;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    showChat();
  } catch (err) {
    authMsg.textContent = err.message;
  }
}

async function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) return;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Register failed");

    authMsg.textContent = "✅ Registered! Please login.";
  } catch (err) {
    authMsg.textContent = err.message;
  }
}

function showChat() {
  chat.innerHTML = ""; // Clear "Please login" or other messages
  auth.style.display = "none";
  form.classList.remove("hidden");
  chat.style.display = "block";
  logoutBtn.classList.remove("hidden");
}

function logout() {
  localStorage.removeItem("token");
  window.location.reload();
}



