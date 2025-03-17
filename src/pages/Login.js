import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";                    // Import axios for making HTTP requests    
import { jwtDecode } from "jwt-decode";       // Import jwt-decode to decode JWT token
import Spinner from "../components/Spinner.js"; // Import LoadingSpinner component
import "../App.css";
import sha256 from "js-sha256";               // Import sha256 for hashing


function Login() {

//----------------------------------------State variables and helper methods------------------------------------------------------

  // These are state variables for the login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State variable to show loading spinner
  const [isLoading, setIsLoading] = useState(false);

  // State variables for machine infos
  const [machineSerialCode, setMachineSerialCode] = useState("");
  const [machineName, setmachineName] = useState("");

  // Use to navigate to different pages
  const navigate = useNavigate();

  // Get browser name for the current device that user is lopgging in
  const getBrowserName = () => {
    if (navigator.userAgent.includes("Chrome")) return "Chrome";
    if (navigator.userAgent.includes("Firefox")) return "Firefox";
    if (navigator.userAgent.includes("Safari")) return "Safari";
    if (navigator.userAgent.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

//----------------------------------------Page auto loading contents------------------------------------------------------
    
  // Get the machine code based on device & browser details
  useEffect(() => {
    const userAgent = navigator.userAgent;                              // Device info
    const screenRes = `${window.screen.width}x${window.screen.height}`; // Screen resolution
    const os = navigator.platform;                                      // OS info
    const browser = getBrowserName();
    setmachineName(`${browser}`);
    setMachineSerialCode(sha256(userAgent + screenRes + os));           // Added up to generate unique machine ID
  }, []);
  


  // Check if user already logged in when page load
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");           // Get token from local storage
      const decoded = jwtDecode(token);                      // Decode the token                 
      navigate("/profile");                                  // If decode is successful, means user logged in, redirect to profile page
    } catch (error) {
      console.error("Invalid token");                        // If token is invalid, show error message   
      localStorage.removeItem("token");                     // Remove invalid token
    }
  }, [navigate]);

//----------------------------------------Form submission handling------------------------------------------------------

  const handleLogin = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Set state of spinner to true (spinning) as the form is submitting
    setIsLoading(true);
    
    try {
      // Make a POST request to check if the email exist and compare password in the database (through api route)
      const response = await axios.post(`${window.location.origin}/api/login`, {
        email,
        password,
        machineSerialCode,
        machineName
      });

      // Set state of spinner to false (stop spinning) as the form is submitted
      setIsLoading(false);

      // If Server received the request and found the user with matching email and password, it will return a success message, status code 200 and JWT token
      if (response.status === 200) { 
        localStorage.setItem("token", response.data.token);       // Store the token in local storage
        localStorage.setItem("hasSimulatedEnergy", "false");
        
        alert("User registered, " + response.data.message);
        navigate("/verify", { state: { email, redirectTo: "/profile" } });     // Redirect to profile page after 2FA
      } 
    } catch (error) {
      // Set state of spinner to false (stop spinning) as the form is submitted
      setIsLoading(false);

      // If user entered wrong login credentials, it will display error message
      if (error.response && error.response.status === 401) {
        // Show error message for invalid credentials
        alert(error.response.data.message);
      } else  {
        // If the error is unknown, show a generic message
        alert(error.response.data.message);
      }
    }
  };

  return (
    
    <div className="login-container">

      {/* Logo */}
      <img
        src="/images/iterationincv3.png"
        alt="Snake logo"
        className="snake-logo"
      />

      {/* Login form */}
      <div className="login">
        <form onSubmit={handleLogin}>

          {/* Login form input field: email and password*/}
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

          {/* Submit button */}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>

          {/* Loading spinner */} 
          {isLoading && <Spinner />}
        </form>

        {/* Helper text: resset password and signup */}
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
