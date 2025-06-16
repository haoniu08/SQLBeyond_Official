import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import PropTypes from "prop-types";

import LeftSidebar from "./Sidebar/LeftSidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import DisplayTables from "./SQLEditorComponents/DisplayTables";
import BadgeModal from "./Modal/BadgeModal";
import LogoutModal from "./Modal/LogoutModal";

import { useAuth } from "./Login/AuthContext";
import { useGame } from "./Context/GameContext";

import badgesData from "../data/badges";
import questions from "../data/questions";
// import logToCSV from "../utils/logger";
import evaluateBadges from "../utils/badgeEvaluator"; // <-- import the badge evaluator

import CountUp from "react-countup";
import logEvent from "../utils/logger";

import "../styles/SQLEditor.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Helper function to compare two result sets ignoring row order.
 * Sorts both arrays by their JSON string so row order doesn't matter.
 */
function compareResultSets(userRows, correctRows) {
  if (!Array.isArray(userRows) || !Array.isArray(correctRows)) return false;
  if (userRows.length !== correctRows.length) return false;

  const sortedUser = [...userRows].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  );
  const sortedCorrect = [...correctRows].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  );

  return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
}

function SQLEditor() {
  const location = useLocation();
  const user = useAuth().user;
  const gameMethods = useGame();
  const gameData = useGame().gameData;

  // Default name from user data
  const { name = `${user.firstName} ${user.lastName}` } = location.state || {};

  // ---------------------- Local States ----------------------
  const [query, setQuery] = useState(
    `example:
SELECT fields
FROM table_name;`
  );
  const [result, setResult] = useState([]);
  const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
  const [message, setMessage] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  const [hintsUsedForQuestion, setHintsUsedForQuestion] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const [startTime, setStartTime] = useState(null);

  const [badges, setBadges] = useState([]);
  const [badgeState, setBadgeState] = useState({
    open: false,
    badgeData: null,
  });

  const [usedQuestions, setUsedQuestions] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [playerPoints, setPlayerPoints] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
  const [hasExecuted, setHasExecuted] = useState(false);

  // For the AI Assistant error guidance
  const [errorHint, setErrorHint] = useState("");

  // ✅ Store expected output (top 5 rows) for the user to see
  const [expectedOutput, setExpectedOutput] = useState([]);

  // ---------------------- Player Stats for Badges ----------------------
  const [playerStats, setPlayerStats] = useState({
    successfulJoins: 0,
    successfulLogicTasks: 0,
    consecutiveTasksWithoutHints: 0,
    lastTaskUsedHints: false,
  });

  // ---------------------- Table Pinning States ----------------------
  const [isTableOn, setIsTableOn] = useState(false);
  const [tableContent, setTableContent] = useState([]);
  const checkTable = useRef(new Set());

  // ---------------------- Logout Modal State ----------------------
  const [logoutModal, setLogoutModal] = useState(false);

  // ---------------------- Helper Functions ----------------------
  const detectJoinUsage = (queryText) => /\bJOIN\b/i.test(queryText);
  const detectLogicUsage = (queryText) => /\b(AND|OR|NOT)\b/i.test(queryText);

  const calculateCompletionTime = () => {
    if (!startTime) return 999999; // fallback if not set
    return Math.floor((Date.now() - startTime) / 1000); // in seconds
  };

  function updatePlayerStats(userQuery, usedHints) {
    setPlayerStats((prev) => {
      const usedHintThisTask = usedHints > 0;
      return {
        successfulJoins: detectJoinUsage(userQuery)
          ? prev.successfulJoins + 1
          : prev.successfulJoins,
        successfulLogicTasks: detectLogicUsage(userQuery)
          ? prev.successfulLogicTasks + 1
          : prev.successfulLogicTasks,
        consecutiveTasksWithoutHints: usedHintThisTask
          ? 0
          : prev.consecutiveTasksWithoutHints + 1,
        lastTaskUsedHints: usedHintThisTask,
      };
    });
  }

  function evaluateAndUnlockBadges() {
    const completedTasks = [
      ...usedQuestions.easy,
      ...usedQuestions.medium,
      ...usedQuestions.hard,
    ];

    const unlockedBadges = evaluateBadges({
      playerPoints,
      retries: retryCount,
      hintsUsedForQuestion,
      completedTasks,
      currentLevel: gameData.currentDifficulty,
      currentTask: gameData.currentQuestion,
      successfulJoins: playerStats.successfulJoins,
      successfulLogicTasks: playerStats.successfulLogicTasks,
      consecutiveTasksWithoutHints: playerStats.consecutiveTasksWithoutHints,
      completionTime: calculateCompletionTime(),
      reflectiveQuestionsCorrect:
        gameData.currentQuestion.reflectiveQuestionsCorrect || false,
    });

    const newBadges = unlockedBadges.filter((b) => !badges.includes(b));

    if (newBadges.length > 0) {
      setBadges((prev) => [...prev, ...newBadges]);
      // new badges are not being saved in the database, this might not be correct
      gameMethods.updateBadges(badges);
      newBadges.forEach((badgeName) => {
        const foundBadge = badgesData.find((bd) => bd.name === badgeName);
        if (foundBadge) {
          openBadgeModal(foundBadge);
        }
      });
    }
  }

  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  // ---------------------- DB Query Functions ----------------------
  const fetchCorrectAnswerResult = useCallback(async (correctQuery) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: correctQuery }),
      });
      const data = await response.json();
      return response.ok ? data.results : null;
    } catch (error) {
      console.error("Error fetching correct answer:", error);
      return null;
    }
  }, []);

  async function executeQuery(userQuery, limitRows = false) {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, limitRows }),
      });
      const data = await response.json();

      if (response.ok) {
        const limitedResult = limitRows
          ? data.results.slice(0, 10)
          : data.results;
        setResult(limitedResult);

        logEvent("RunQuery", {
          userQuery: userQuery,
          result: limitedResult
      });
      } else {
        setResult([{ error: "Syntax error or invalid query." }]);
        setMessage("❌ Try again");
        setTimeout(() => {
          setMessage(`${gameData.currentQuestion.question}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server." }]);
      setMessage("❌ Try again");

      logEvent("RunQuery", {
        userQuery: userQuery,
        result: "Invalid Query"
    });
      setTimeout(() => {
        setMessage(`${gameData.currentQuestion.question}`);
      }, 3000);
    }
  }

  async function submitQuery(userQuery) {
    const timestamp = new Date().toISOString();
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });
      const data = await response.json();

      if (response.ok) {
        setResult(data.results);
        setErrorHint("");
        checkAnswer(data.results, userQuery);
    
        logEvent("SubmitQuery", {
            userQuery: userQuery,
            result: data.results,
            status: "Success"
        });
    } else {
        setErrorHint("Your query has a syntax error or is invalid.");
        logEvent("SubmitQuery", {
            userQuery: userQuery,
            result: "Invalid Query",
            status: "Error"
        });
    }    
    } catch (error) {
      console.error("Error:", error);
      setErrorHint("An error occurred while connecting to the server.");
      // logToCSV({
      //   timestamp,
      //   action: "Query Submitted",
      //   query: userQuery,
      //   result: "Server Error",
      //   status: "Error",
      // });
    }
  }

  // ---------------------- Answer Checking ----------------------
  const checkAnswer = useCallback(
    (userResult, userQuery) => {
      const correct = compareResultSets(userResult, correctAnswerResult);

      const questionDifficulty = gameData.currentQuestion.difficulty;
      let earnedPoints = correct ? gameData.currentQuestion.points : 0;
      earnedPoints = Math.max(earnedPoints - hintsUsedForQuestion, 0);

      if (correct) {
        logEvent("CorrectAnswer", {
          userQuery: userQuery,
          earnedPoints: earnedPoints
      });
        // update local points
        setPlayerPoints((prevPoints) => {
          const updatedPoints = { ...prevPoints };
          updatedPoints[questionDifficulty] = [
            ...updatedPoints[questionDifficulty],
            earnedPoints,
          ];
          return updatedPoints;
        });

        // update total XP
        gameMethods.updatePoints(gameData.points, earnedPoints);
        gameMethods.updateGameDataObjects('playerPoints', earnedPoints);

        // check if new total XP is enough to level up
        const newTotalPoints = gameData.points + earnedPoints;
        if (newTotalPoints >= 100 && gameData.currentDifficulty === "easy") {
          gameMethods.updateGameData("currentDifficulty", "medium");
          setMessage("✨ You've leveled up to Medium! ✨");
        } else if (
          newTotalPoints >= 200 &&
          gameData.currentDifficulty === "medium"
        ) {
          gameMethods.updateGameData("currentDifficulty", "hard");
          setMessage("✨ You've leveled up to Hard! ✨");
        }

        updatePlayerStats(userQuery, hintsUsedForQuestion);

        triggerConfetti();
        evaluateAndUnlockBadges();

        setTimeout(() => {
          setMessage("");
          loadQuestion();
        }, 3000);
      } else {
         logEvent("WrongAnswer", {
        userQuery: userQuery,
        retryCount: retryCount + 1
    });
        setRetryCount((prev) => prev + 1);
        setMessage("❌ Try again");
        setTimeout(() => {
          setMessage(`${gameData.currentQuestion.question}`);
        }, 3000);
      }
    },
    [
      correctAnswerResult,
      gameData.currentQuestion,
      gameData.currentDifficulty,
      hintsUsedForQuestion,
      gameData.points,
      playerPoints,
    ]
  );

  // ---------------------- Loading Questions ----------------------
  const loadQuestion = useCallback(async () => {
    // also reset hints here if we want to be extra sure
    gameMethods.updateGameData("hintsUsedForQuestion", 0);
    setHintsUsedForQuestion(0);
    setButtonsDisabled(true);

    const questionList = questions[gameData.currentDifficulty];
    // const remainingQuestions = questionList.filter(
    //   (q) => !usedQuestions[gameData.currentDifficulty].includes(q.question)
    // );

    const remainingQuestions = questionList.filter(
      (q) => !gameData.usedQuestions[gameData.currentDifficulty].includes(q.question)
    );

    let selectedQuestion;
    if (remainingQuestions.length > 0) {
      selectedQuestion =
        remainingQuestions[
          Math.floor(Math.random() * remainingQuestions.length)
        ];
      setUsedQuestions((prev) => ({
        ...prev,
        [gameData.currentDifficulty]: [
          ...prev[gameData.currentDifficulty],
          selectedQuestion.question,
        ],
      }));

      // add used questions to the database
      gameMethods.updateGameDataObjects("usedQuestions", selectedQuestion.question);
    } else {
      setUsedQuestions((prev) => ({
        ...prev,
        [gameData.currentDifficulty]: [],
      }));
      // reset used questions
      gameMethods.resetUsedQuestions();
      selectedQuestion =
        questionList[Math.floor(Math.random() * questionList.length)];
    }

    if (selectedQuestion) {
      // upadate the current question in the DB
      gameMethods.updateGameData("currentQuestion", selectedQuestion);
      setStartTime(Date.now());

      const correctResult = await fetchCorrectAnswerResult(
        selectedQuestion.answer
      );
      setExpectedOutput(correctResult ? correctResult.slice(0, 5) : []);
      setCorrectAnswerResult(correctResult);

      setMessage(`${selectedQuestion.question}`);
      setTimeout(() => setButtonsDisabled(false), 2000);
    }
  }, [gameData.currentDifficulty, fetchCorrectAnswerResult, usedQuestions]);

  // ---------------------- Effects ----------------------
  useEffect(() => {
    if (!hasExecuted) {
      setHasExecuted(true);
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      if (userData.idealSlope) {
        setDynamicIdealPoints([
          userData.idealSlope.easy,
          userData.idealSlope.medium,
          userData.idealSlope.hard,
        ]);
      }
    }
  }, [hasExecuted, loadQuestion, name]);

  // useEffect(() => {
  //   gameMethods.updateBadges(badges);
  // }, [badges]);

  useEffect(() => {
    const loadCurrentResult = async () => {
      const correctResult = await fetchCorrectAnswerResult(
        gameData.currentQuestion.answer
      );
      setExpectedOutput(correctResult ? correctResult.slice(0, 5) : []);
      setCorrectAnswerResult(correctResult);
    };

    if (gameData) setBadges(gameData.badges);
    if(gameData){
      setMessage(gameData.currentQuestion.question);
      setButtonsDisabled(false);
      loadCurrentResult();
    }
  }, []);

  // ---------------------- Badge Modal ----------------------
  function openBadgeModal(badge) {
    setBadgeState({ open: true, badgeData: badge });
  }

  function closeBadgeModal() {
    setBadgeState({ open: false, badgeData: null });
  }

  // ---------------------- Table Toggling ----------------------
  function handleTableActions() {
    setIsTableOn((prev) => !prev);
  }

  function addTableContent(table) {
    if (checkTable.current.has(table.name)) return;
    checkTable.current.add(table.name);
    setTableContent((prev) => [...prev, table]);
  }

  function removeTableContent(table) {
    if (!checkTable.current.has(table.name)) return;
    checkTable.current.delete(table.name);
    setTableContent((prev) => prev.filter((t) => t.name !== table.name));
  }

  // ---------------------- Logout Modal ----------------------
  function openLogoutModal() {
    setLogoutModal(true);
  }
  function closeLogoutModal() {
    setLogoutModal(false);
  }

  // ---------------------- Pinned Table Animation ----------------------
  const [animationClass, setAnimationClass] = useState("");
  function handleAnimationClick() {
    setAnimationClass("jump-animation");
    setTimeout(() => {
      setAnimationClass("");
    }, 1000);
  }

  // ---------------------- Render ----------------------
  return (
    <div className="sql-editor-container">
      {/* Badge modal */}
      {badgeState.open && (
        <BadgeModal
          closeBadgeModal={closeBadgeModal}
          badgeData={badgeState.badgeData}
        />
      )}

      {/* Logout modal */}
      {logoutModal && <LogoutModal closeLogoutModal={closeLogoutModal} />}

      {/* Left Sidebar */}
      <LeftSidebar
        message={message}
        handleTableContent={addTableContent}
        expectedOutput={expectedOutput}
        handleAnimationClick={handleAnimationClick}
        gameData={gameData}
      />

      {/* Main Editor */}
      <div className="main-editor">
        <Editor
          setQuery={setQuery}
          query={query}
          executeQuery={(content) => executeQuery(content, true)}
          submitQuery={submitQuery}
          buttonsDisabled={buttonsDisabled}
          progress={gameData?.points || 0}
          currentDifficulty={gameData?.currentDifficulty || "easy"}
        />

        {/* XP Progress Bar */}
        <div className="xp-progress-bar">
          <div className="xp-labels">
            <span>
              XP:{" "}
              <CountUp start={0} end={gameData.points} duration={1.5} separator="," />
            </span>
            <span>
              Level: {gameData.currentDifficulty} ({gameData.points}/
              {gameData.currentDifficulty === "easy"
                ? 100
                : gameData.currentDifficulty === "medium"
                ? 200
                : 300}
              )
            </span>
          </div>
          <div className="xp-bar-wrapper">
            <div
              className="xp-bar"
              style={{
                width: `${
                  (gameData.points /
                    (gameData.currentDifficulty === "easy"
                      ? 100
                      : gameData.currentDifficulty === "medium"
                      ? 200
                      : 300)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Result Section */}
        <div className="result">
          <div className="result-btns">
            <button onClick={() => setIsTableOn(false)}>Query Results</button>
            <button onClick={handleTableActions} className={animationClass}>
              Pinned Tables
            </button>
          </div>

          {isTableOn ? (
            <DisplayTables
              tableContent={tableContent}
              removeTable={removeTableContent}
            />
          ) : (
            <QueryResult result={result} />
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        progress={gameData?.points || 0}
        query={query}
        taskDescription={gameData.currentQuestion}
        currentQuestionPoints={gameData.currentQuestion.points}
        retries={retryCount}
        badges={badges}
        badgesData={badgesData}
        openBadgeModal={openBadgeModal}
        pointsData={playerPoints}
        idealPoints={dynamicIdealPoints}
        errorHint={errorHint}
        hintsUsedForQuestion={hintsUsedForQuestion}
        setHintsUsedForQuestion={setHintsUsedForQuestion}
        user={user}
        openLogoutModal={openLogoutModal}
        gameData={gameData}
        gameMethods={gameMethods}
      />
    </div>
  );
}

// ---------------------- Sub-Components ----------------------
function QueryResult({ result }) {
  return (
    <>
      <h3>Query Result:</h3>
      <div className="table-container">
        {Array.isArray(result) ? (
          <table>
            <thead>
              <tr>
                {result.length > 0 &&
                  Object.keys(result[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {result.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre>{result}</pre>
        )}
      </div>
    </>
  );
}

QueryResult.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]).isRequired,
};

QueryResult.defaultProps = {
  result: [],
};

export default SQLEditor;