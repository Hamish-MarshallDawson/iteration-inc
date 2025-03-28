import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 
import sha256 from "js-sha256";

export default function SignUpStep2() {

//----------------------------------------State variables and helper methods------------------------------------------------------
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from previous page where it redirected from
  const email = location.state?.email || "";

  // State for form inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [machineSerialCode, setMachineSerialCode] = useState("");
  const [machineName, setmachineName] = useState("");

  // State for spinner
  const [isLoading, setIsLoading] = useState(false);

  // Validation function for passwords and names
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,30}$/.test(password); // At least 8 characters, 30 chars max, 1 uppercase letter, 1 number
  };
  const isValidName = (name) => {
    return /^[A-Za-z'-]{2,25}$/.test(name); // Allows letters, hyphen -, and apostrophe ’, min 2, max 25 chars
  };
  
  // Function to get browser name
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
    const userAgent = navigator.userAgent; // Device info
    const screenRes = `${window.screen.width}x${window.screen.height}`; // Screen resolution
    const os = navigator.platform; // OS info
    const browser = getBrowserName();
    setmachineName(`${browser}`);
    setMachineSerialCode(sha256(userAgent + screenRes + os)); // Generate unique machine ID
  }, []);

//----------------------------------------Form submission handling------------------------------------------------------

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if two entreis of passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Check if user's name is valid
    if (!isValidName(firstName) || !isValidName(lastName)) {
      alert(
        "First and Last Name must be between 2 and 25 characters long and contain only letters, hyphens, or apostrophes."
      );
      setIsLoading(false);
      return;
    }

    // Check if password is valid
    if (!isValidPassword(password)) {
      alert(
        "Password must be between 8 and 30 characters long, contain a number, and an uppercase letter."
      );
      setIsLoading(false);
      return;
    }


    // Everything is valid, then store them to database, and redirect to login page
    try {

      // Send user's data to backend for database record creation
      const response = await axios.post(`${window.location.origin}/api/user`, {
        action: "register",
        firstName,
        lastName,
        email,
        password,
        machineSerialCode,
        machineName
      });

      setIsLoading(false);

      // Receive response after request
      if (response.status === 201) {
        // If insertion success, then prompt to user and redirect to log in page
        alert("Account successfully created!");
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      // Otherwise show an error message
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };
//----------------------------------------------------------------------------------------------------------------------

  return (
    <div className="login-container">
      <img
        src="/images/iterationincv3.png"
        alt="Snake logo"
        className="snake-logo"
      />

      <div className="login">
        <h2 style={{ textAlign: "center" }}>Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="inputFields">
            <div className="input">
              <label>Email:</label>
              <input type="email" value={email} disabled />
            </div>

            <div className="input">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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

            <div className="input">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>
          {isLoading && <Spinner />}
          
          <button
            onClick={() => navigate("/sign-up")}
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}
