import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

const quiz = {
  totalQuestions: 9,
  perQuestionScore: 5,
  questions: [
    // Easy questions
    {
      question: "Which SQL statement is used to retrieve data from a database?",
      choices: ["SELECT", "GET", "FETCH", "RETRIEVE"],
      correctAnswer: "SELECT",
      difficulty: "easy",
    },
    {
      question: "Which clause is used to filter records in SQL?",
      choices: ["WHERE", "FILTER", "GROUP BY", "ORDER BY"],
      correctAnswer: "WHERE",
      difficulty: "easy",
    },
    {
      question: "How do you sort results in ascending order in SQL?",
      choices: ["ORDER BY ASC", "SORT ASC", "ASCENDING", "SORT BY ASC"],
      correctAnswer: "ORDER BY ASC",
      difficulty: "easy",
    },
    // Medium questions
    {
      question: "Which SQL statement is used to insert new data into a table?",
      choices: ["INSERT INTO", "ADD INTO", "INSERT NEW", "ADD RECORD"],
      correctAnswer: "INSERT INTO",
      difficulty: "medium",
    },
    {
      question: "What SQL keyword removes duplicates from results?",
      choices: ["DISTINCT", "UNIQUE", "DELETE", "CLEAN"],
      correctAnswer: "DISTINCT",
      difficulty: "medium",
    },
    {
      question: "Which SQL statement is used to update existing records?",
      choices: ["UPDATE", "MODIFY", "ALTER", "CHANGE"],
      correctAnswer: "UPDATE",
      difficulty: "medium",
    },
    // Hard questions
    {
      question: "What SQL clause is used to group rows based on column values?",
      choices: ["GROUP BY", "ORDER BY", "PARTITION", "MERGE"],
      correctAnswer: "GROUP BY",
      difficulty: "hard",
    },
    {
      question: "How do you delete all rows from a table?",
      choices: ["DELETE FROM", "TRUNCATE TABLE", "DROP TABLE", "REMOVE TABLE"],
      correctAnswer: "TRUNCATE TABLE",
      difficulty: "hard",
    },
    {
      question: "Which SQL function is used to calculate the average value?",
      choices: ["AVG", "SUM", "COUNT", "MEAN"],
      correctAnswer: "AVG",
      difficulty: "hard",
    },
  ],
};

// function mapInitialScoreToStartingPoint(score, maxScore) {
//   if (score <= 0.25 * maxScore) return 0.3; // Slightly higher starting point
//   else if (score <= 0.5 * maxScore) return 0.5; // Adjusted slope
//   else if (score <= 0.75 * maxScore) return 0.7;
//   return 0.9; // More refined slope
// }

function QuestionaireForUsers() {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  // const maxScore = questions.length * quiz.perQuestionScore;

  const onClickNext = () => {
    setResult((prev) => {
      const currentQuestion = questions[activeQuestion];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      return {
        ...prev,
        score: prev.score + (isCorrect ? quiz.perQuestionScore : 0),
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: prev.wrongAnswers + (!isCorrect ? 1 : 0),
        [currentQuestion.difficulty]: {
          ...(prev[currentQuestion.difficulty] || { correct: 0, total: 0 }),
          correct:
            (prev[currentQuestion.difficulty]?.correct || 0) +
            (isCorrect ? 1 : 0),
          total: (prev[currentQuestion.difficulty]?.total || 0) + 1,
        },
      };
    });

    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
    }
  };

  const onAnswerSelected = (answer) => {
    setSelectedAnswer(answer);
  };

  const saveQuizSummary = async () => {
    const {
      easy = { correct: 0, total: 0 },
      medium = { correct: 0, total: 0 },
      hard = { correct: 0, total: 0 },
    } = result;

    // previous quizz data
    // const quizData = {
    //   userId: "user123", // Replace with dynamic user ID
    //   questionDetails: questions.map((q) => ({
    //     question: q.question,
    //     correctAnswer: q.correctAnswer,
    //     difficulty: q.difficulty,
    //   })),
    //   timeTaken: 120, // Replace with actual total time
    //   score: result.score,
    //   correctAnswers: result.correctAnswers,
    //   wrongAnswers: result.wrongAnswers,
    //   performanceByDifficulty: { easy, medium, hard },
    // };

    const quizData = {
      questionDetails: questions.map((q) => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
      })),
      timeTaken: 120, // Replace with actual total time
      score: result.score,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      performanceByDifficulty: { easy, medium, hard },
    };

    try {
      await axios.post(`${apiUrl}/account/quiz-grade`, {
        quizData: quizData
    }, { withCredentials: true });
    } catch (err) {
      console.error("Error saving quiz summary:", err);
    }
  };

  const continueToSQL = () => {
    const {
      easy = { correct: 0, total: 0 },
      medium = { correct: 0, total: 0 },
      hard = { correct: 0, total: 0 },
    } = result;

    const easyPerformance = easy.correct / (easy.total || 1); // Avoid division by 0
    const mediumPerformance = medium.correct / (medium.total || 1);
    const hardPerformance = hard.correct / (hard.total || 1);

    const idealSlope = {
      easy: Math.round(10 + easyPerformance * 10),
      medium: Math.round(10 + mediumPerformance * 20),
      hard: Math.round(10 + hardPerformance * 30),
    };

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, idealSlope })
    );
    saveQuizSummary();
    navigate("/SQLEditor");
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <div className="quiz-small-container">
          <h2>{questions[activeQuestion].question}</h2>
          <ul>
            {questions[activeQuestion].choices.map((choice, index) => (
              <li
                key={index}
                onClick={() => onAnswerSelected(choice)}
                className={selectedAnswer === choice ? "selected-answer" : null}
              >
                {choice}
              </li>
            ))}
          </ul>
          <button onClick={onClickNext} disabled={!selectedAnswer}>
            {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      ) : (
        <div className="result quest-result">
          <h3>Quiz Completed</h3>
          <p>Total Questions: {questions.length}</p>
          <p>Score: {result.score}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Wrong Answers: {result.wrongAnswers}</p>
          <button onClick={continueToSQL}>Continue to SQL Practice</button>
        </div>
      )}
    </div>
  );
}

export default QuestionaireForUsers;
