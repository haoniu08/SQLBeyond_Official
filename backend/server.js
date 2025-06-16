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
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!MYSQL_URL || !HUGGINGFACE_API_KEY) {
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

// Chat endpoint to interact with Hugging Face API
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    res.json({
      success: true,
      response: response.data.generated_text || "No response generated.",
    });
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err);
    res.status(500).json({ error: "Failed to interact with Hugging Face." });
  }
});

// // SQL generation endpoint using Hugging Face API
// app.post("/generate-sql", async (req, res) => {
//   const { prompt } = req.body;
//   console.log(prompt);
//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required." });
//   }

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
//       {
//         inputs: prompt,
//         parameters: { max_length: 50, temperature: 0.7 },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         },
//       }
//     );

//     res.json({
//       success: true,
//       response:
//         response.data.generated_text ||
//         response.data[0]?.generated_text ||
//         "No response generated.",
//     });
//   } catch (err) {
//     console.error("Error interacting with Hugging Face:", err.message);
//     res.status(500).json({ error: "Failed to generate SQL." });
//   }
// });

app.post("/generate-sql", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );
    console.log(response);
    // Extract only the text after "Hint: "
    const generatedText =
      response.data.generated_text || response.data[0]?.generated_text || "";
    const hint =
      generatedText.split("Hint: ")[1]?.trim() || "No hint generated.";

    res.json({
      success: true,
      response: hint,
    });
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err.message);
    res.status(500).json({ error: "Failed to generate SQL." });
  }
});

// Personalized hint generation endpoint
app.post("/personalized-hint", async (req, res) => {
  const { userQuery, taskDescription } = req.body;
  if (!userQuery || !taskDescription) {
    return res.status(400).json({
      error: "Both userQuery and correctQuery are required.",
    });
  }

  const prompt = `Analyze the following incorrect SQL query and provide a hint to fix it or if its correct then encourage the user to submit (under 25 words). Only output the hint without any additional explanation or repetition. User Query: "${userQuery}" Correct Query: "${taskDescription.answer}" Hint:`;
  console.log(prompt);
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );

    const generatedText =
      response.data[0]?.generated_text || "No response generated.";

    // Split and extract the last part after "Hint:"
    const hint = generatedText.split("Hint:").pop().trim();

    console.log(hint); // Output: "Query looks correct. Submit it!"
    res.json({ success: true, response: hint }); // Send only the extracted hint text
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err.message);
    res.status(500).json({ error: "Failed to generate personalized hint." });
  }
});

// ---------------------- routes -------------------
// account route (developed in the routes/account.js)
app.use("/account", userRouter);
// game route (developed in the routes/game.js)
app.use("/game", gameRouter);

// app.post("/generate-sql", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required." });
//   }

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/defog/sqlcoder-7b-2",
//       {
//         inputs: prompt,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json({
//       success: true,
//       response: response.data?.generated_text || "No response generated.",
//     });
//   } catch (err) {
//     console.error("Error interacting with Hugging Face:", err.message);
//     res.status(500).json({ error: "Failed to generate SQL." });
//   }
// });

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
