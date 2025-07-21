require('./serverDataPush');

const fs = require('fs');
const logDir = './logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log("Logs directory created:", logDir);
}

const mysql = require("mysql2/promise"); // Use promise-based MySQL
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const session = require('express-session');

//import the account router 
const userRouter = require('./routes/user');
const gameRouter = require('./routes/game');

const cookieParser = require("cookie-parser");
const sqlParser = require("sql-parser"); // SQL Parser for syntax validation

//mongo db
const { closeMongodbConnection } = require("./utils/mongodb");

// Load and validate environment variables
const PORT = process.env.PORT || 5001;
const MYSQL_URL = process.env.MYSQL_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Debug: Check if API key is loaded (remove this after debugging)
console.log("OpenAI API Key loaded:", OPENAI_API_KEY ? "YES" : "NO");
console.log("API Key starts with:", OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + "..." : "NOT SET");

if (!MYSQL_URL || !OPENAI_API_KEY) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

const FRONTED_URL = process.env.FRONTED_URL || "http://localhost:5173"

// Express app setup
const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: FRONTED_URL,
    credentials: true,
  })
);
app.use(express.json());

// Express cookie-parser - cors was changed as well
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "create a better secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// MySQL Connection Pool
const pool = mysql.createPool(MYSQL_URL);

// (async () => {
//   try {
//     await pool.getConnection(); // Test the database connection
//     console.log("Connected to the database.");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1);
//   }
// })();

// Endpoint to execute a SQL query
app.post("/execute-query", async (req, res) => {
  const { query, params } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const [results] = await pool.execute(query, params || []);
    res.json({ success: true, results });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ success: false, error: "Error executing query." });
  }
});

app.post("/get-hint", (req, res) => {
  const { userQuery, taskDescription, retries } = req.body;

  if (!taskDescription || retries === undefined || !userQuery) {
    return res
      .status(400)
      .json({ error: "Task description, retries, and query are required." });
  }

  const { concepts, columnNames, hints } = taskDescription;

  // Stage 1: Check Missing Concepts or Columns.
  const checkForMissingItems = (query, items) => {
    return items.filter(
      (item) => !query.toUpperCase().includes(item.toUpperCase())
    );
  };

  const missingConcepts = checkForMissingItems(userQuery, concepts);
  const missingColumns = checkForMissingItems(userQuery, columnNames);

  if (missingConcepts.length > 0 || missingColumns.length > 0) {
    const hint = `\nYour query is missing the following: ${missingConcepts.length > 0
        ? `\nKeywords: ${missingConcepts.join(", ")}`
        : ""
      } ${missingColumns.length > 0 ? `\nColumns: ${missingColumns.join(", ")}` : ""
      }`.trim();
    return res.json({
      success: true,
      stage: "S1",
      hint,
    });
  }

  // Stage 2: Metaphorical Guidance.
  // if (hints.metaphor) {
  //   return res.json({
  //     success: true,
  //     stage: "S2",
  //     hint: hints.metaphor,
  //   });
  // }

  // Stage 3: English-Based Query Guidance.
  // if (hints.english) {
  //   return res.json({
  //     success: true,
  //     stage: "S3",
  //     hint: hints.english,
  //   });
  // }

  // Default case: Debugging hint.
  const hint =
    "Check the structure of your query. Ensure all required elements (keywords, columns, and table) are included and correctly specified.";
  return res.json({
    success: true,
    stage: "S4",
    hint,
  });
});

// Chat endpoint to interact with OpenAI API (optional, not used by AI Assistant)
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      response: response.data.choices[0].message.content || "No response generated.",
    });
  } catch (err) {
    console.error("Error interacting with OpenAI:", err);
    res.status(500).json({ error: "Failed to interact with OpenAI." });
  }
});

app.post("/generate-sql", async (req, res) => {
  const { prompt: _prompt, taskDescription } = req.body;
  let messages;
  if (taskDescription && taskDescription.question && taskDescription.answer) {
    messages = [
      {
        role: "system",
        content: `You are a helpful SQL tutor. Always reply in the following format (IMPORTANT: Your response must be concise and no more than 60 words.):\n\n[Optional: a relatable metaphor or scenario]\n\nTo do this in SQL, you'd need to:\n    1. [Step 1]\n    2. [Step 2]\n    3. [Step 3]\n    ...\n\nExample:\n🧠 Hint 2 — "I need some help planning this" (Strategic)\n\nImagine you're making a shopping list grouped by each customer — you'd list their total purchases of "Gizmo". To do this in SQL, you'd need to:\n    1. Filter the orders to only include the product "Gizmo".\n    2. Group the results by each customer.\n    3. Use SUM() to calculate total units purchased per customer.\n    4. Use HAVING to filter those totals where they exceed 10.`
      },
      {
        role: "user",
        content: `Task: "${taskDescription.question}"
Correct Query: "${taskDescription.answer}"
Generate a strategic, step-by-step plan for this task.`
      }
    ];
  } else {
    messages = [
      { role: "user", content: _prompt }
    ];
  }
  if (!messages) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const generatedText = response.data.choices[0].message.content || "";
    res.json({
      success: true,
      response: generatedText,
    });
  } catch (err) {
    console.error("Error interacting with OpenAI:", err.message);
    console.error("Full error:", err.response?.data || err);
    res.status(500).json({ error: "Failed to generate SQL." });
  }
});

app.post("/personalized-hint", async (req, res) => {
  const { userQuery, taskDescription } = req.body;
  if (!userQuery || !taskDescription) {
    return res.status(400).json({
      error: "Both userQuery and correctQuery are required.",
    });
  }

  const messages = [
    {
      role: "system",
      content: `You are a helpful SQL tutor. Always reply in the following format IMPORTANT: Your response must be concise and no more than 60 words.:\n\nRight now your query:\n    • [Issue 1]\n    • [Issue 2]\n    • [Issue 3]\n\n[Short advice paragraph about what to do next, referencing relevant SQL concepts.]\n\nExample:\n🔍 Hint 3 — "Explain what's wrong" (Content-Specific)\n\nRight now your query:\n    • Doesn't group purchases by customer (GROUP BY is missing).\n    • Doesn't sum the Quantity column, so you can't check total units.\n    • Doesn't have a HAVING clause to filter customers with more than 10 units.\n\nConsider joining the Customers and Orders tables if needed, and then applying SUM(Quantity), GROUP BY CustomerID, CustomerName, and a HAVING SUM(Quantity) > 10 condition.`
    },
    {
      role: "user",
      content: `Task: "${taskDescription.question}"
Correct Query: "${taskDescription.answer}"
User Query: "${userQuery}"
Analyze the user's query and generate a content-specific hint as described above.`
    }
  ];
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.choices[0].message.content || "No response generated.";
    res.json({ success: true, response: generatedText });
  } catch (err) {
    console.error("Error interacting with OpenAI:", err.message);
    console.error("Full error:", err.response?.data || err);
    res.status(500).json({ error: "Failed to generate personalized hint." });
  }
});

// ---------------------- routes -------------------
// account route (developed in the routes/account.js)
app.use("/account", userRouter);
// game route (developed in the routes/game.js)
app.use("/game", gameRouter);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const closeConnections = async () => {
  try {
    await closeMongodbConnection();
    server.close(() => {
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => closeConnections());

// ---------------------- Logging API -------------------
app.post("/api/log", (req, res) => {
  const logEntry = req.body;

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const safeString = JSON.stringify(logEntry, null, 2);
    fs.appendFileSync(`${logDir}/logs.txt`, safeString + '\n');
    res.json({ success: true, message: "Log saved." });
  } catch (err) {
    console.error("Failed to save log:", err);
    res.status(500).json({ error: "Failed to save log." });
  }
});
