import { Routes, Route } from "react-router-dom";
import QuestionaireForUsers from "./components/QuestionaireForUsers";
import SQLEditor from "./components/SQLEditor";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import AuthProvider from "./components/Login/AuthContext";
import PrivateRoute from "./components/Login/PrivateRoute";
import GameProvider from "./components/Context/GameContext";
import WelcomeIntro from "./components/WelcomeIntro";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<WelcomeIntro />} />
          <Route element={<PrivateRoute />}>
            <Route path="/quiz" element={<QuestionaireForUsers />} />
            <Route path="/SQLEditor" element={<SQLEditor />} />
          </Route>
        </Routes>
    </AuthProvider>
  );
}

export default App;
