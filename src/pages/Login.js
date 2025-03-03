import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests and to be able to communicate with the back-end server
import Spinner from "../components/Spinner.js"; // Import LoadingSpinner component

import "../App.css";

function Login() {
  // These are state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use to navigate to different pages
  const navigate = useNavigate();

  // Function to handle form submission
  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send a POST request to the backend with email and password that user entered

      //
      const response = await axios.post("./api/login", { email, password });

      // const response = await axios.post("http://localhost:5000/api/login", {
      //   email,
      //   password,
      // })

      setIsLoading(false);
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
        navigate("/profile"); // Redirect to the Profile Page
      }
    } catch (error) {
      setIsLoading(false);
      // Otherwise, if user entered wrong login credentials, it will display error message
      if (error.response && error.response.status === 401) {
        // Show error message for invalid credentials
        alert(error.response.data.message);
        alert("Invalid email or password");
      } else if (error.request) {
        // If request was made but server did not respond
        alert("No response from server. Please try again later.");
      } else {
        // Or may be server did not receive request at all, it was network error or something, display general error message
        alert(error.response.data.message);
        alert("Shit went wrong. Please try again.");
      }
    }
  };

  // Rendering login page
  return (
    <div className="login-container">
      <img
        src="/images/iterationincv3.png"
        alt="Snake logo"
        className="snake-logo"
      />
      <div className="login">
        <form onSubmit={handleLogin}>
          <div className="inputFields">
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
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
          {isLoading && <Spinner />} {/* Use the Spinner component here */}
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
    </div>
  );
}
export default Login;
