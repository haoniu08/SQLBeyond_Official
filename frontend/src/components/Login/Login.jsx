import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "../../styles/Authentication.css";
import { useAuth } from "./AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const auth = useAuth();

  if(auth.user){
    // Check for introSeen in localStorage
    if (auth.user.quizData)
      return <Navigate to="/SQLEditor" replace />;
    if (!localStorage.getItem("introSeen"))
      return <Navigate to="/welcome" replace />;
    return <Navigate to="/quiz" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.login(formData);
  };

  return (
    <section className="log-section">
      <div className="log-box">
        <div className="log-text">
          <h1>SQLBeyond</h1>
          <p>Log in</p>
          <p>Don't have account yet? <Link to="/register">Sign up</Link></p>
        </div>
        <div className="log-options">
          <form onSubmit={handleSubmit} className="log-form-box">
            <input 
              type="text" 
              placeholder="Email address*" 
              id="username"
              name="username"
              onChange={handleChange}
              required/>

            <input 
              type="password" 
              placeholder="Password*" 
              id="password"
              name="password"
              onChange={handleChange}
              required/>
            <button>Continue</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login;
