import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import "../css/login-page.css";

// testing something
function Login() {
  //these are state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
        const response = await axios.post("http://localhost:5000/api/login", {
            email,
            password,
        });

        if (response.status === 200) {
            alert("User registered, " + response.data.message);  // Show success message
            navigate('/');  // Redirect to the Home Page
        }
    }catch(error){    
        alert('Invalid email or password');
        alert("Login failed, " + error);
    }

  };

  return (
    <div className="login">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div className="input">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>

      <div className="helper-text">
        <p>
          <Link to="/passwordReset">Forgot Password?</Link>
        </p>
        <p>
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
