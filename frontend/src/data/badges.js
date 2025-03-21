import joinExpert from './../assets/badges/join-expert.png';
import levelUp from './../assets/badges/level-up.png';
import logicPro from './../assets/badges/logic-pro.png';
import noHintHero from './../assets/badges/no-hint-hero.png';
import persistentLearner from './../assets/badges/persistent-learner.png';
import quickSolver from './../assets/badges/quick-solver.png';
import reflectiveThinker from './../assets/badges/reflective-thinker.png';
import sqlChampion from './../assets/badges/sql-champion.png';
import steadyProgress from './../assets/badges/steady-progress.png';
import syntaxMaster from './../assets/badges/syntax-master.png';

const badgesData = [
  {
    displayName: "Join Expert",
    name: "joinExpert",
    criteria: "Successfully complete a task using SQL JOINs.",
    badge: joinExpert,
  },
  {
    displayName: "Level Up",
    name: "levelUp",
    criteria: "Progress to the next proficiency level (e.g., Beginner → Intermediate).",
    badge: levelUp,
  },
  {
    displayName: "Logic Pro",
    name: "logicPro",
    criteria: "Solve 3 consecutive tasks using logical operators (AND, OR, NOT).",
    badge: logicPro,
  },
  {
    displayName: "No-Hint Hero",
    name: "noHintHero",
    criteria: "Solve 3 consecutive tasks without using hints.",
    badge: noHintHero,
  },
  {
    displayName: "Persistent Learner",
    name: "persistentLearner",
    criteria: "Solve a task successfully after 3+ incorrect attempts.",
    badge: persistentLearner,
  },
  {
    displayName: "Quick Solver",
    name: "quickSolver",
    criteria: "Solve a query in under 2 minutes.",
    badge: quickSolver,
  },
  {
    displayName: "Reflective Thinker",
    name: "reflectiveThinker",
    criteria: "Answer reflective feedback questions correctly after solving a query.",
    badge: reflectiveThinker,
  },
  {
    displayName: "SQL Champion",
    name: "sqlChampion",
    criteria: "Complete all challenges in the game.",
    badge: sqlChampion,
  },
  {
    displayName: "Steady Progress",
    name: "steadyProgress",
    criteria: "Complete 3 tasks within a single session.",
    badge: steadyProgress,
  },
  {
    displayName: "Syntax Master",
    name: "syntaxMaster",
    criteria: "Solve 5 tasks without any syntax errors.",
    badge: syntaxMaster,
  },
];

export default badgesData;