import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";
import DifficultyChart from "./DifficultyChart"; // Import the chart

const RightSidebar = ({
  // setProgress, // Function to update progress/points
  query, // User's current query
  taskDescription, // Description of the current task/question
  retries, // Retry count for the current question
  badges, // List of earned badges
  badgesData, // Metadata for all available badges
  openBadgeModal, // Function to open badge modal
  pointsData, // Points distribution data for the chart
  idealPoints, // Ideal points for difficulty levels
  errorHint, // Error hints for AI Assistant
  user,
  openLogoutModal,
  gameData,
  gameMethods,
}) => {
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleLogout = () => {
    openLogoutModal(true);
  };

  const handleUseHint = () => {
    gameMethods.updateGameData(
      "hintsUsedForQuestion",
      gameData.hintsUsedForQuestion + 1
    );
    // console.log("Hint used! Points deducted.");
  };

  // const progressPercentage = Math.min((progress / 100) * 100, 100); // Cap at 100%

  // useEffect(() => {
  //   if (progress >= 100) {
  //     // Display 100% for 3 seconds, then reset back to the actual progress
  //     setDisplayFullProgress(true);
  //     const timer = setTimeout(() => {
  //       setDisplayFullProgress(false);
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [progress, badges]);

  return (
    <div className="right-sidebar">
      {/* Points and Achievements */}
      <div className="points-system">
        <span className="right-sidebar-header">
          <h2>Hi, {`${user.firstName} ${user.lastName}`}</h2>
          <button onClick={handleLogout}>Logout</button>
        </span>

        {/* <div className="points-ps">
          <p>
            <strong>Current Points:</strong> <br /> {progress} / 100
          </p>
          <p>
            <strong>Points for this Question:</strong> {adjustedQuestionPoints}
          </p>
        </div> */}
      </div>

      {/* Achievements */}
      <div className="achievements">
        <h3>Achievements</h3>
        <div className="badges-container">
          {badgesData.map((badge) => {
            return (
              <div
                key={badge.name}
                className={`badge-container ${
                  badges.includes(badge.name) ? "" : "gray-image"
                }`}
                onClick={() => openBadgeModal(badge)}
              >
                <img src={badge.badge} alt={badge.name} />
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        handleUseHint={handleUseHint}
        hintsUsed={hintsUsed}
        maxHints={100}
        taskDescription={taskDescription}
        query={query}
        retries={retries}
        errorHint={errorHint} // Pass error hint
      />

      {/* Difficulty Chart */}
      <div className="difficulty-chart">
        <h3>Performance</h3>
        <DifficultyChart pointsData={pointsData} idealPoints={idealPoints} />
     </div>

      {/* Placeholder for Task Progress */}
      <div className="placeholder-section">
        <h4> Task Progress</h4>
        <div className="progress-placeholder">[TODO: Progress bar here]</div>
      </div>

      {/* Placeholder for Badge Tracker */}
      <div className="placeholder-section">
        <h4> Badge Tracker</h4>
        <div className="badge-placeholder">[TODO: Badge list here]</div>
      </div>
   </div>
  );
};

RightSidebar.propTypes = {
  // progress: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  taskDescription: PropTypes.object.isRequired,
  currentQuestionPoints: PropTypes.number.isRequired,
  retries: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  badgesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  openBadgeModal: PropTypes.func.isRequired,
  pointsData: PropTypes.object.isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  errorHint: PropTypes.string,
  // hintsUsedForQuestion: PropTypes.number.isRequired,
  // setHintsUsedForQuestion: PropTypes.func.isRequired,
};

export default RightSidebar;
