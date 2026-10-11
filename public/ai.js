(function () {
  const player = LocalProfile.getCurrent();
  if (!player) {
    window.location.href = "login.html";
    return;
  }

  document.body.className = localStorage.getItem("appTheme") || "theme-dark-emerald";

  const form = document.getElementById("aiChatForm");
  const promptInput = document.getElementById("aiPrompt");
  const chatLog = document.getElementById("aiChatLog");
  const sendButton = document.getElementById("aiSendButton");
  const status = document.getElementById("aiStatus");
  const profile = document.getElementById("aiProfile");
  const historyKey = `arenaBuddyMessages:${player.email}`;
  let messages = [];
  try {
    const storedMessages = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (Array.isArray(storedMessages)) {
      messages = storedMessages.filter(message =>
        message && ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
      ).slice(-12);
      messages.forEach(message => appendMessage(message.role, message.content));
    }
  } catch (error) {
    localStorage.removeItem(historyKey);
  }
  profile.textContent = `${player.name} · Level ${player.completedLevel}`;
  const greeting = chatLog.querySelector(".ai-message-assistant");
  if (greeting && messages.length === 0) {
    greeting.textContent = `Hi ${player.name}! I’m Arena Buddy, your Quiz Game teammate. Ask me about trivia, game strategy, or your progress at level ${player.completedLevel}.`;
  }
  let isSending = false;

  function appendMessage(role, content) {
    const message = document.createElement("div");
    message.className = `ai-message ${role === "user" ? "ai-message-user" : "ai-message-assistant"}`;
    message.textContent = content;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const content = promptInput.value.trim();
    if (!content || isSending) return;

    isSending = true;
    sendButton.disabled = true;
    promptInput.disabled = true;
    status.textContent = "";
    promptInput.value = "";
    appendMessage("user", content);
    messages.push({ role: "user", content });

    try {
      if (!navigator.onLine) {
        throw new Error("Arena Buddy needs internet. Your saved profile and games still work offline.");
      }
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.slice(-12),
          profile: { name: player.name, completedLevel: player.completedLevel }
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success || typeof data.answer !== "string") {
        throw new Error(data.message || "Arena Buddy could not answer. Please try again.");
      }

      messages.push({ role: "assistant", content: data.answer });
      messages = messages.slice(-12);
      localStorage.setItem(historyKey, JSON.stringify(messages));
      appendMessage("assistant", data.answer);
    } catch (error) {
      status.textContent = error.message || "Could not connect to Arena Buddy.";
    } finally {
      isSending = false;
      sendButton.disabled = false;
      promptInput.disabled = false;
      promptInput.focus();
    }
  });
})();
