import { useState } from "react";
import { useNavigate } from "react-router-dom";

function WelcomeIntro() {
  const [dontShow, setDontShow] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (dontShow) {
      localStorage.setItem("introSeen", "true");
    }
    navigate("/quiz");
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "100px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      padding: "2.5em 2em",
      textAlign: "center"
    }}>
      <h1>Welcome to SQLBeyond!</h1>
      <p style={{ fontSize: "1.1em", margin: "1.5em 0" }}>
        <strong>Practice SQL</strong> by solving real-world challenges.<br /><br />
        <strong>Hints:</strong> Use the SAGE assistant if you get stuck. Fewer hints = more XP!<br /><br />
        <strong>XP & Levels:</strong> Earn XP for each challenge. Level up to unlock harder questions.<br /><br />
        <strong>Badges:</strong> Achieve milestones (like “No-Hint Hero”) and collect badges as you progress.<br /><br />
        Make the most of every feature to boost your learning!
      </p>
      <label style={{ display: "block", margin: "1em 0" }}>
        <input
          type="checkbox"
          checked={dontShow}
          onChange={e => setDontShow(e.target.checked)}
          style={{ marginRight: 8 }}
        />
        Don’t show this again
      </label>
      <button
        onClick={handleContinue}
        style={{
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "12px 32px",
          fontSize: "1.1em",
          cursor: "pointer"
        }}
      >
        Continue
      </button>
    </div>
  );
}

export default WelcomeIntro; 