import { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import "../App.css";

export default function Verify() {
  // State variablles
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeExpiration, setCodeExpiration] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [countdown, setCountdown] = useState(30);

  const navigate = useNavigate(); 
  const location = useLocation();

  // Retrieve email that passed from last page 
  const email = location.state?.email || "";  
  // Retrieve the target page that passed from last page, default to home if missing
  const redirectTo = location.state?.redirectTo || "/";

  // A boolean flag 
  let flag = false;

  // Functiona that can generate a random 4-digit code
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Function to generate and store the verification code & set expiration time to 30 second & set count down on the page & alert code to simulate it was send to the email
  const generateAndStoreCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
    setCodeExpiration(Date.now() + 30000);
    setCountdown(30); 
    alert(`Your verification code is: ${code}`);
  };

  // Automatically generate and send code when the page loads
  useEffect(() => {
    if (!flag) {
        generateAndStoreCode();
        flag = true;
    }
  }, []); 

  //Display a count down of 30s on the page
  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((codeExpiration - Date.now()) / 1000));
      setCountdown(remainingTime);
      if (remainingTime === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); 
  }, [codeExpiration]);
  

  const verifyCode = () => {
    // Check if code is expired (date.now > date.then+30s) or not generated
    if (!generatedCode || Date.now() > codeExpiration) {
      alert("Code expired! Please generate a new one.");
      return;
    }

    // Check if the input code matches the generated code
    if (inputCode === generatedCode) {
      alert("Verification successful!");
      if (redirectTo) {
        // redirect to the page that was passed in the state, also with email
        navigate(redirectTo, { state: { email } });
      }
    } else {
      alert("Incorrect code. Try again.");
    }
  };

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

        <button onClick={verifyCode} className="submit-button">
          Verify
        </button>

        <button onClick={generateAndStoreCode} className="submit-button">
          Resend Code
        </button>

        <button onClick={() => navigate(-1)} className="submit-button">
          Go Back
        </button>
      </div>
    </div>
  );
}
