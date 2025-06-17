import { useState, useEffect } from "react";
import "../../../styles/AIAssistant.css";
import PropTypes from "prop-types";
import axios from "axios";
import logToCSV from "../../../utils/logger";
import { motion } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const AIAssistant = ({
  handleUseHint, // Deducts 1 point
  hintsUsed,
  maxHints,
  taskDescription,
  query,
  retries,
  errorHint,
}) => {
  const [message, setMessage] = useState("Need help? I'm here for you!");
  const [response, setResponse] = useState(""); // Current hint or error message
  const [hints, setHints] = useState([]); // Store all provided hints
  const [showCard, setShowCard] = useState(false);

  // We no longer do `if (showModal) ...` to unmount. Instead, we track isClosing too.
  const [showModal, setShowModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const [showHintChoices, setShowHintChoices] = useState(false);

  // Loading state to show spinner and disable buttons
  const [isLoading, setIsLoading] = useState(false);

  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null); // 'up' or 'down'

  // Reset card state and hints when the task changes
  useEffect(() => {
    setShowCard(false);
    // For new tasks, close any open hint modals:
    setShowModal(false);
    setIsModalClosing(false);
    setResponse("");
    setMessage("Need help? I'm here for you!");
    setHints([]);
    setShowHintChoices(false);
    setFeedbackGiven(false);
    setFeedbackType(null);
  }, [taskDescription]);

  // Display error hints automatically
  useEffect(() => {
    if (errorHint) {
      const errorMessage = `Error: ${errorHint}`;
      setHints((prevHints) => [errorMessage, ...prevHints]);
      setResponse(errorMessage);
      setMessage("There was an issue with your query:");
      setShowCard(true);
    }
  }, [errorHint]);

  // Toggle the modal with animation
  const handleToggleModal = () => {
    // If the modal is already open, begin closing animation
    if (showModal) {
      setIsModalClosing(true);
    } else {
      // Otherwise open it
      setShowModal(true);
      setIsModalClosing(false);
    }
  };

  // Called when the modal's open/close animation ends
  const handleModalAnimationEnd = () => {
    // If we just finished the closing animation, unmount the modal
    if (isModalClosing) {
      setShowModal(false);
      setIsModalClosing(false);
    }
  };

  // Close the hint choices if clicking outside
  useEffect(() => {
    if (!showHintChoices) return;
    const handleClickOutside = (e) => {
      // Only close if click is outside the hint choices row
      if (!e.target.closest('.hint-choices-row') && !e.target.closest('.hint-button')) {
        setShowHintChoices(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHintChoices]);

  // Refactored: Each button triggers its own handler
  const handleHintButtonClick = async (tier) => {
    if (hintsUsed >= maxHints) {
      setMessage('You have used all your hints!');
      setShowHintChoices(false);
      return;
    }
    handleUseHint();
    setIsLoading(true);
    try {
      if (tier === 1) {
        await handleGetHint();
      } else if (tier === 2) {
        await handleGetAIHint();
      } else if (tier === 3) {
        await handleGetPersonalizedHint();
      }
    } finally {
      setIsLoading(false);
      setShowHintChoices(false);
    }
  };

  // 1) Standard hint
  const handleGetHint = async () => {
    if (!taskDescription || !query) {
      setMessage("Ensure your query and task description are available.");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/get-hint`, {
        userQuery: query,
        taskDescription,
        retries,
      });

      if (res.data.success) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newHint = {
          content: `Hint: ${res.data.hint}`,
          tier: "Tier 1",
          time: now,
          status: "No correction"
        };
        setHints((prevHints) => [newHint, ...prevHints]);
        setResponse(newHint.content);
        setMessage("Hint provided!");
        setShowCard(true);

        // After 10 seconds, change message to ask if they want another hint
        setTimeout(() => {
          setMessage("Need another hint?");
        }, 10000);

        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Standard",
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
          hintsUsedForQuestion: hintsUsed + 1,
        });
      } else {
        setMessage("Unable to fetch hint. Try again later.");
      }
    } catch (err) {
      console.error("Error fetching hint:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  // 2) AI-generated metaphorical hint
  const handleGetAIHint = async () => {
    if (!taskDescription || !query) {
      setMessage("Ensure your query and task description are available.");
      return;
    }

    const prompt = `Create a metaphorical hint for the SQL task: "${taskDescription.question}". The correct query is: "${taskDescription.answer}". The hint must:
- Use a meaningful metaphor.
- Be approximately under 30 words.
- Avoid repeating or rephrasing the query or task.
- Output only the hint without any additional explanation or context.
Hint:`;

    try {
      const res = await axios.post(`${apiUrl}/generate-sql`, { prompt });

      if (res.data.success) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiHint = {
          content: `AI Hint: ${res.data.response}`,
          tier: "Tier 2",
          time: now,
          status: "No correction"
        };
        setHints((prevHints) => [aiHint, ...prevHints]);
        setResponse(aiHint.content);
        setMessage("AI-generated hint provided!");
        setShowCard(true);

        // After 10 seconds, change message
        setTimeout(() => {
          setMessage("Need another hint?");
        }, 10000);

        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "AI",
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
          hintsUsedForQuestion: hintsUsed + 1,
        });
      } else {
        setMessage("Unable to fetch AI hint. Try again later.");
      }
    } catch (err) {
      console.error("Error fetching AI hint:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  // 3) Personalized hint comparing userQuery and correct query
  const handleGetPersonalizedHint = async () => {
    if (!query || !taskDescription?.answer) {
      setMessage(
        "Ensure both the user's query and the correct query are available."
      );
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/personalized-hint`, {
        userQuery: query,
        taskDescription,
      });

      if (res.data.success) {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const personalizedHint = {
          content: `Personalized Hint: ${res.data.response}`,
          tier: "Tier 3",
          time: now,
          status: "No correction"
        };
        setHints((prevHints) => [personalizedHint, ...prevHints]);
        setResponse(personalizedHint.content);
        setMessage("Personalized hint provided!");
        setShowCard(true);

        // After 10 seconds, change message
        setTimeout(() => {
          setMessage("Need another hint?");
        }, 10000);

        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Personalized",
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
          hintsUsedForQuestion: hintsUsed + 1,
        });
      } else {
        console.error("API Error:", res.data.error || "Unknown error");
        setMessage("Unable to fetch personalized hint.");
      }
    } catch (error) {
      console.error("Error fetching personalized hint:", error.message);
      setMessage("An error occurred while fetching the personalized hint.");
    }
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handleFeedback = (type) => {
    setFeedbackGiven(true);
    setFeedbackType(type);
    // For now, just log. Replace with API call if needed.
    console.log(`Hint feedback: ${type === 'up' ? 'useful' : 'not useful'}`, response);
  };

  return (
    <div className="ai-assistant">
      <motion.div
        className="motion-div-avatar"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="ping-bubble"></div>
        <div className="sage-bubble">
          <p>SAGE</p>
        </div>
      </motion.div>

      <motion.div
        className="motion-div-bubble"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Display the current message */}
        <p className="assistant-message">{message}</p>
      </motion.div>

      <div className="assistant-buttons">
        <div style={{ position: 'relative' }}>
          <button
            className="hint-button"
            onClick={() => setShowHintChoices((v) => !v)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Loading...
                <span className="loading-spinner" />
              </>
            ) : (
              "Ask SAGE"
            )}
          </button>
          {showHintChoices && !isLoading && (
            <div className="hint-choices-row" style={{
              position: 'absolute',
              left: 0,
              right: 0,
              margin: '0 auto',
              top: '110%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              padding: '0.75rem 1rem',
              zIndex: 20,
              justifyContent: 'center',
              alignItems: 'stretch',
              minWidth: '260px',
            }}>
              <button onClick={() => handleHintButtonClick(1)} className="hint-choice-btn hint-choice-thinking">Give me a thinking hint</button>
              <button onClick={() => handleHintButtonClick(2)} className="hint-choice-btn hint-choice-strategic">I need some help planning this</button>
              <button onClick={() => handleHintButtonClick(3)} className="hint-choice-btn hint-choice-content">Explain what's wrong</button>
            </div>
          )}
        </div>
        <button
          className="show-hints-button"
          onClick={handleToggleModal}
          disabled={isLoading}
        >
          Hints Log
        </button>
      </div>

      {/* Hint/Error Card */}
      {showCard && (
        <div className="hint-card">
          <div className="hint-card-content">
            <h5>{response.startsWith("Error:") ? "Query Error" : "Hint"}</h5>
            <p>{response || "Your hint will appear here!"}</p>
            {/* Feedback buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5em', margin: '1em 0 0.5em 0' }}>
              <button
                className="hint-feedback-btn"
                onClick={() => handleFeedback('up')}
                disabled={feedbackGiven}
                aria-label="This hint was useful"
              >
                👍
              </button>
              <button
                className="hint-feedback-btn"
                onClick={() => handleFeedback('down')}
                disabled={feedbackGiven}
                aria-label="This hint was not useful"
              >
                👎
              </button>
            </div>
            {feedbackGiven && (
              <div style={{ textAlign: 'center', color: '#2563eb', fontWeight: 500, marginBottom: '0.5em' }}>
                Thank you for your feedback!
              </div>
            )}
            <button className="close-button" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hints Modal with open/close animation */}
      {(showModal || isModalClosing) && (
        <div
          className={`hints-modal ${isModalClosing ? "closing" : ""}`}
          onAnimationEnd={handleModalAnimationEnd}
        >
          <div className="hints-modal-content">
            <h5>All Hints:</h5>
            <div
              className="hints-list"
              style={{ overflowY: "auto", maxHeight: "300px" }}
            >
              <ul>
              {hints.map((hint, index) => (
                <li key={index}>
                  <div><strong>{hint.tier}</strong> used at {hint.time} — {hint.status}</div>
                  <div>{hint.content}</div>
                </li>
              ))}
              </ul>
            </div>
            <button className="close-modal-button" onClick={handleToggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AIAssistant.propTypes = {
  handleUseHint: PropTypes.func.isRequired,
  hintsUsed: PropTypes.number.isRequired,
  maxHints: PropTypes.number.isRequired,
  taskDescription: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  retries: PropTypes.number.isRequired,
  errorHint: PropTypes.string,
};

export default AIAssistant;
