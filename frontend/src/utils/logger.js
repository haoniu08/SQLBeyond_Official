// utils/logger.js

// Generate SessionId (only generated on first use)
function initSessionId() {
  if (!localStorage.getItem("sessionId")) {
    const newId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("sessionId", newId);
  }
}

// Ensure sessionId exists during initialization
initSessionId();

const getSessionId = () => localStorage.getItem("sessionId") || "unknown";

// General log sending function
const sendLog = async (logEntry) => {
  try {
    const response = await fetch("http://localhost:5001/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
    });

    if (!response.ok) {
      console.error("Failed to send log:", response.status);
    }
  } catch (err) {
    console.error("Error sending log:", err);
  }
};

// Main exported logEvent factory function
const logEvent = async (eventType, eventPayload = {}) => {
  const logEntry = {
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    eventType,
    eventPayload
  };

  // Send log to backend
  await sendLog(logEntry);

  // Also store a local backup (useful for debugging)
  try {
    const existingLogs = JSON.parse(localStorage.getItem("userLogs") || "[]");
    existingLogs.push(logEntry);
    localStorage.setItem("userLogs", JSON.stringify(existingLogs));
  } catch (e) {
    console.error("Local log storage error:", e);
  }
};

export default logEvent;
