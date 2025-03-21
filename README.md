# 📘 Project Documentation: SQL Beyond - Hazra Imran

## 📂 Project Overview

**SQL Beyond** is an interactive gamified SQL learning platform designed to teach SQL concepts in an engaging way. Users can practice queries, receive AI-assisted hints, unlock badges, and progress through various SQL challenges. This project features a **React-based frontend** and a **Node.js & Express backend** with MongoDB as the database.

---

## 📑 Directory Structure

```
hazraimran-sqlbeyond/
├── package.json               # Main project configuration
├── backend/                    # Backend (Node.js, Express, MongoDB)
│   ├── package backup.json     # Backup of backend dependencies
│   ├── package-lock.json       # Dependency lock file
│   ├── package.json            # Backend dependencies
│   ├── server.js                # Main server file
│   ├── serverDataPush.js        # Script to pre-seed data into the database
│   ├── .env                     # Environment variables
│   ├── .gitattributes
│   ├── .gitignore
│   ├── routes/                   # API routes
│   │   ├── game.js                # Game-related API endpoints
│   │   └── user.js                # User-related API endpoints
│   └── utils/                     # Utility files
│       └── mongodb.js            # MongoDB connection utility
└── frontend/                    # Frontend (React + Vite)
    ├── eslint.config.js         # Linting rules
    ├── index.html                # Main entry HTML file
    ├── package-lock.json
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite config file
    ├── .env                       # Environment variables
    ├── .gitattributes
    ├── .gitignore
    ├── public/                    # Static files
    └── src/                       # Source code
```

---

## 🛠️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/hazraimran-sqlbeyond.git
cd hazraimran-sqlbeyond
```

---

### 2️⃣ Run the Backend (Server)

```bash
cd backend
npm install
npm run start
```

- The backend will run on **http://localhost:5001** (or the port configured in your `.env` file).
- Ensure you have a **MongoDB connection string** configured in `backend/.env`.

---

### 3️⃣ Run the Frontend (React App)

In a new terminal, run:

```bash
cd frontend
npm install
npm run dev
```

- The frontend will run on **http://localhost:5173** (or the port configured in `vite.config.js`).

---

### 4️⃣ (Optional) Seed Initial Data

If you want to pre-fill your MongoDB with sample questions, tables, and badges:

```bash
cd backend
node serverDataPush.js
```

---

### 5️⃣ Open the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API (test endpoint): [http://localhost:5000](http://localhost:5000)

---

## ✅ Summary of Key Commands

| Command                               | Description                            |
| ------------------------------------- | -------------------------------------- |
| `npm install` (in backend & frontend) | Install dependencies                   |
| `npm run start` (in backend)          | Start the backend server               |
| `npm run dev` (in frontend)           | Start the frontend in development mode |
| `node serverDataPush.js`              | Populate MongoDB with sample data      |
