// frontend/src/utils/badgeEvaluator.js

const TOTAL_TASKS_COUNT = 2; // Update based on your actual total number of tasks

const evaluateBadges = ({
  playerPoints,
  retries,
  hintsUsedForQuestion,
  completedTasks,
  currentLevel,
  currentTask,
  successfulJoins,
  successfulLogicTasks,
  consecutiveTasksWithoutHints,
  completionTime,
  reflectiveQuestionsCorrect,
}) => {
  const unlockedBadges = [];

  // Join Expert: Successfully complete a task using SQL JOINs.
  if (successfulJoins >= 1) {
    unlockedBadges.push("joinExpert");
  }

  // Level Up: Progress to next proficiency level (Beginner → Intermediate).
  if (currentLevel === "Intermediate" || currentLevel === "Hard") {
    unlockedBadges.push("levelUp");
  }

  // Logic Pro: Solve 3 consecutive tasks using logical operators (AND, OR, NOT).
  if (successfulLogicTasks >= 3) {
    unlockedBadges.push("logicPro");
  }

  // No-Hint Hero: Solve 3 consecutive tasks without using hints.
  if (consecutiveTasksWithoutHints >= 3) {
    unlockedBadges.push("noHintHero");
  }

  // Persistent Learner: Solve a task successfully after 3+ incorrect attempts.
  if (retries >= 3 && completedTasks.includes(currentTask?.question)) {
    unlockedBadges.push("persistentLearner");
  }

  // Quick Solver: Solve a query in under 2 minutes (120 seconds).
  if (completionTime && completionTime <= 120) {
    unlockedBadges.push("quickSolver");
  }

  // Reflective Thinker: Answer reflective feedback questions correctly after solving a query.
  if (reflectiveQuestionsCorrect) {
    unlockedBadges.push("reflectiveThinker");
  }

  // SQL Champion: Complete all challenges in the game.
  if (completedTasks.length >= TOTAL_TASKS_COUNT) {
    unlockedBadges.push("sqlChampion");
  }

  // Steady Progress: Complete 3 tasks within a single session.
  if (completedTasks.length >= 3) {
    unlockedBadges.push("steadyProgress");
  }

  // Syntax Master: Solve 5 tasks without any syntax errors.
  const totalTasksWithoutSyntaxErrors = playerPoints.easy
    .concat(playerPoints.medium, playerPoints.hard)
    .filter((points) => points > 0).length;
  if (totalTasksWithoutSyntaxErrors >= 5) {
    unlockedBadges.push("syntaxMaster");
  }

  return unlockedBadges;
};

export default evaluateBadges;
