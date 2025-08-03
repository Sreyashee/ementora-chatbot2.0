document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("historyContainer");
    const token = localStorage.getItem("token");
  
    if (!token) {
      container.textContent = "You are not logged in.";
      return;
    }
  
    try {
      const res = await fetch("/api/chat/history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!res.ok) throw new Error("Failed to fetch history");
  
      const history = await res.json();
      console.log("Fetched history:", history);
  
      if (!history.length) {
        container.textContent = "No chat history found.";
        return;
      }
  
      history.forEach(entry => {
        const div = document.createElement("div");
        div.className = "chat-entry";
  
        const time = new Date(entry.timestamp).toLocaleString();
  
        div.innerHTML = `
          <strong>${entry.sender === "user" ? "You" : "Bot"}:</strong> ${entry.message}<br>
          <small>${time}</small>
          <hr/>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      container.textContent = `Error: ${err.message}`;
    }
  });
  
  
  
