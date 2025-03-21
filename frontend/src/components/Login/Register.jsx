import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "../../styles/Authentication.css";
import { useAuth } from "./AuthContext";

function Register() {
  const [formData, setFormData] = useState({ firstName:"", lastName:"", username: "", password: "" });
  const auth = useAuth();

  if(auth.user){
      if(auth.user.quizData)
        return <Navigate to="/SQLEditor" replace />;
      return <Navigate to="/quiz" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      auth.register(formData);
    }
    catch(err){
      console.error(err);
    }
  };

  return (
    <section className="log-section">
      <div className="log-box">
        <div className="log-text">
          <h1>SQLBeyond</h1>
          <p>Sign up</p>
          <p>Already have an account yet? <Link to="/">Sign in</Link></p>
        </div>
        <div className="log-options">
          <form onSubmit={handleSubmit} className="log-form-box">
            <input
              type="text"
              placeholder="Fist Name*"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              required />

            <input
              type="text"
              placeholder="Last Name*"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              required />

            <input
              type="text"
              placeholder="Email address*"
              id="username"
              name="username"
              onChange={handleChange}
              required />

            <input
              type="password"
              placeholder="Password*"
              id="password"
              name="password"
              onChange={handleChange}
              required />
            <button>Continue</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Register;
