import { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import "../App.css";

export default function Verify() {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeExpiration, setCodeExpiration] = useState(null);
  const [inputCode, setInputCode] = useState("");

  const navigate = useNavigate(); 
  const location = useLocation();

  const email = location.state?.email || "";            // Retrieve email
  const redirectTo = location.state?.redirectTo || "/"; // Default to home if missing

  let flag = false;

  // Functiona that can generate a random 4-digit code
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Automatically generate and send code when the page loads
  useEffect(() => {
    if (!flag) {
        generateAndStoreCode();
        flag = true;
    }
  }, []); 
  

  // Function to generate and store the verification code & set expiration time
  const generateAndStoreCode = () => {
    const code = generateCode();
    setGeneratedCode(code);
    setCodeExpiration(Date.now() + 30000);
    alert(`Your verification code is: ${code}`);
  };

  const verifyCode = () => {
    // Check if code is expired or not generated
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

        <button onClick={verifyCode} className="submit-button">
          Verify
        </button>

        <button onClick={generateAndStoreCode} className="submit-button">
          Resend Code
        </button>

        <button onClick={() => navigate(-1)} className="submit-button" style={{ backgroundColor: "red" }}>
          Go Back
        </button>
      </div>
    </div>
  );
}
