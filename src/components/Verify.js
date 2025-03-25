import { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import "../App.css";
import Spinner from "../components/Spinner.js";

export default function Verify() {

//----------------------------------------State variables and helper methods------------------------------------------------------
  // State variablles
  const [generatedCode, setGeneratedCode] = useState(null);     // Stores the generated 4-digit verification code
  const [codeExpiration, setCodeExpiration] = useState(null);   // Stores the expiration time (30s)
  const [inputCode, setInputCode] = useState("");               // Stores user input for the verification code
  const [countdown, setCountdown] = useState(30);               // Stores the countdown timer (in seconds)

  const navigate = useNavigate();         // React Router hook for navigation
  const location = useLocation();         // React Router hook for getting passed state (email & redirectTo)
  const [isLoading, setIsLoading] = useState(false);

   // Retrieves email passed from the previous page 
  const email = location.state?.email || "";  
  // Retrieves target page after verification, default to log in if missing
  const redirectTo = location.state?.redirectTo || "/";

  // Functiona that can generate a random 4-digit code
  const generateCode = () => {
    // Math.random() generates a random number between 0 and 1 (e.g. 0.1111111)
    // Multiply by 9000 to get a number between 0 and 9000 (e.g. 1111.111)
    // Add 1000 to get a number between 1000 and 10000 (e.g. 2111.111), also ensured it is a 4-digit number
    // Math.floor() rounds down to the nearest integer (e.g. 2111)
    // toString() converts the number to a string (e.g. "2111")
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Function to generate and store the verification code & set expiration time to 30 second & set count down on the page & alert code to simulate it was send to the email
  const generateAndStoreCode = () => {
    const code = generateCode();                      // Generate a new verification code
    setGeneratedCode(code);                           // Store the generated code in state
    setCodeExpiration(Date.now() + 30000);            // Set expiration time to 30 seconds from now
    setCountdown(30);                                 // Reset countdown timer
    alert(`Your verification code is: ${code}`);      // Simulate sending the code via email
  };

  // Function to verify the input code against the generated code
  const verifyCode = () => {
    setIsLoading(true); 
    // Check if code is expired (date.now > date.then+30s) or not generated
    if (!generatedCode || Date.now() > codeExpiration) {
      alert("Code expired! Please generate a new one.");
      setIsLoading(false);
      return;
    }

    // Check if the input code matches the generated code
    if (inputCode === generatedCode) {
      //setIsLoading(false);
      alert("Verification successful!");
      if (redirectTo) {
        // redirect to the page that was passed in the state, also with email
        navigate(redirectTo, { state: { email } });
      }
    } else {
      setIsLoading(false);
      alert("Incorrect code. Try again.");
    }
  };

  const loginGoBack = () => {
    localStorage.removeItem("token");   
    navigate(-1); 
  };

//----------------------------------------Page auto loading contents------------------------------------------------------

  // Automatically generate and send code when the page loads
  useEffect(() => {
      generateAndStoreCode();
  }, []); 

  //Display a count down of 30s on the page
  useEffect(() => {

    const interval = setInterval(() => {
      // Calculate the remaining time in seconds
      // Math.max(0, ...) ensures the remaining time is never negative, minimum is 0, which means the code has expired
      // Math.floor(...) rounds down to the nearest integer
      // (codeExpiration - Date.now()) calculates the remaining time in milliseconds
      // Divide by 1000 to convert milliseconds to seconds
      const remainingTime = Math.max(0, Math.floor((codeExpiration - Date.now()) / 1000));

      // Update the countdown timer on the page
      setCountdown(remainingTime);

      // If the remaining time is 0, clear the interval
      if (remainingTime === 0) {
        clearInterval(interval);
      }
    }, 1000);  // Checking the reamining time every 1s(1000ms)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval); 
  }, [codeExpiration]);


//------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="login-container"> {/* Reuse login container for same layout */}
      <img
        src="/images/iterationincv3.png"
        alt="Snake logo"
        className="snake-logo"
      />

      <div className="login"> {/* Reuse login box styling */}
        <h2 style={{ textAlign: "center" }}>
          Enter Verification Code
        </h2>

        {email && <p style={{ textAlign: "center" }}>Verifying for: <strong>{email}</strong></p>}

        <div className="inputFields">
          <div className="input">
            <label>Verification Code:</label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Enter code"
              required
            />
          </div>
        </div>

        <p style={{ textAlign: "center", color: countdown === 0 ? "red" : "black" }}>
          {countdown > 0 ? `Code expires in: ${countdown}s` : "Code expired! Request a new code."}
        </p>

        <button onClick={verifyCode} className="submit-button" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </button>
        {isLoading && <Spinner />}

        <button onClick={generateAndStoreCode} className="submit-button">
          Resend Code
        </button>

        <button onClick={loginGoBack} className="submit-button">
          Go Back
        </button>
      </div>
    </div>
  );
}
