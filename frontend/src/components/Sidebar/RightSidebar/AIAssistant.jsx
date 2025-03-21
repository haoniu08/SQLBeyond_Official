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

  const [clickStage, setClickStage] = useState(0); // 0 => standard, 1 => AI, 2 => personalized

  // Loading state to show spinner and disable buttons
  const [isLoading, setIsLoading] = useState(false);

  // Reset card state and hints when the task changes
  useEffect(() => {
    setShowCard(false);
    // For new tasks, close any open hint modals:
    setShowModal(false);
    setIsModalClosing(false);
    setResponse("");
    setMessage("Need help? I'm here for you!");
    setHints([]);
    setClickStage(0);
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

  // Called when the modal’s open/close animation ends
  const handleModalAnimationEnd = () => {
    // If we just finished the closing animation, unmount the modal
    if (isModalClosing) {
      setShowModal(false);
      setIsModalClosing(false);
    }
  };

  /**
   * Main sequence for "Ask SAGE" button:
   *  1) Check if user has hints left
   *  2) Deduct 1 point
   *  3) Set loading = true
   *  4) Call the correct hint function (standard, AI, or personalized)
   *  5) On success/failure, set loading = false
   *  6) Bump clickStage up to a max of 2
   */
  const handleHintSequence = async () => {
    if (hintsUsed >= maxHints) {
      setMessage("You have used all your hints!");
      return;
    }

    // Deduct 1 point for the hint
    handleUseHint();

    setIsLoading(true);
    try {
      if (clickStage === 0) {
        await handleGetHint();
      } else if (clickStage === 1) {
        await handleGetAIHint();
      } else {
        await handleGetPersonalizedHint();
      }
      setClickStage((prev) => (prev >= 2 ? 2 : prev + 1));
    } finally {
      setIsLoading(false);
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
        const newHint = `Hint: ${res.data.hint}`;
        setHints((prevHints) => [newHint, ...prevHints]);
        setResponse(newHint);
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
        const aiHint = `AI Hint: ${res.data.response}`;
        setHints((prevHints) => [aiHint, ...prevHints]);
        setResponse(aiHint);
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
        const personalizedHint = `Personalized Hint: ${res.data.response}`;
        setHints((prevHints) => [personalizedHint, ...prevHints]);
        setResponse(personalizedHint);
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
        <button
          className="hint-button"
          onClick={handleHintSequence}
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? (
            <>
              Loading...
              {/* You can also add a spinner graphic or CSS animation here */}
              <span className="loading-spinner" />
            </>
          ) : (
            "Ask SAGE"
          )}
        </button>
        <button
          className="show-hints-button"
          onClick={handleToggleModal}
          disabled={isLoading} // Also disable the hints log
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
                  <li key={index}>{hint}</li>
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
