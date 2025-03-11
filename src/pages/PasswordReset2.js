import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; 
import "../App.css";
import Spinner from "../components/Spinner.js"; 

export default function PasswordResetStep2() {
  const location = useLocation();
  const email = location.state?.email || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to check if password is valid, same as in SignUp2.js
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password is valid
    if (!isValidPassword(newPassword)) {
      alert("Password must be at least 8 characters, contain a number, and an uppercase letter.");
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      // Send password reset request to the API
      const response = await axios.post(`${window.location.origin}/api/resetPassword`, {
        email,
        newPassword,
      });

      setIsLoading(false);

      if (response.status === 200) {
        alert("Password reset successful! Redirecting to Login");
        navigate("/"); 
      }

    } catch (error) {
      setIsLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="login-container">
      <img
        src="/images/iterationincv3.png"
        alt="Snake logo"
        className="snake-logo"
      />

      <div className="login">
        <h2 style={{ textAlign: "center" }}>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputFields">
            <div className="input">
              <label>Email:</label>
              <input type="email" value={email} disabled />
            </div>
            <div className="input">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          {isLoading ? "Loading..." : "Reset Password"}
          </button>
          {isLoading && <Spinner />}

        {/* Go Back Button - Redirects to Password Reset Page 1 */}
        <button onClick={() => navigate(-1)} className="submit-button">
          Go Back
        </button>
        </form>
      </div>
    </div>
  );
}
