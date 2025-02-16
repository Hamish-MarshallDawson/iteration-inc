import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";                      // Import axios for making HTTP requests and to be able to communicate with the back-end server

import "../css/login-page.css";


function Login() {
  // These are state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Use to navigate to different pages
  const navigate = useNavigate();       

  // Function to handle form submission
  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    try{
        // Send a POST request to the backend with email and password that user entered
        const response = await axios.post("http://localhost:5000/api/login", {
            email,
            password,
        });

        // If Server received the request and found the user with matching email and password, it will return a success message and status code 200
        if (response.status === 200) {
            //Then we alert the user that login was successful and redirect to the Home Page
            /*
                !!!!!!!!
                !!!!!!!!
                !!!!!!!!
                !!!!!!!!
                should redirect to a 2 factor authentication page not home page
            */
            alert("User registered, " + response.data.message); 
            navigate('/');  // Redirect to the Home Page
        }
    }catch(error){    

        // Otherwise, if user entered wrong login credentials, it will display error message
        if (error.response && error.response.status === 401) {
            // Show error message for invalid credentials
            alert('Invalid email or password');  
          } else {
            // Or may be server did not receive request at all, it was network error or something, display general error message
            alert('Shit went wrong. Please try again.');  
        }
    }

  };

  // Rendering login page
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
