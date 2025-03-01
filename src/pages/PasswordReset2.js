import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function PasswordResetStep2() {
  const location = useLocation();
  const email = location.state?.email || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Function to check if password is valid, same as in SignUp2.js
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password is valid
    if (!isValidPassword(newPassword)) {
      alert("Password must be at least 8 characters, contain a number, and an uppercase letter.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password reset successful! Redirecting to Login...");
    navigate("/");
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

          <button type="submit" className="submit-button">
            Reset Password
          </button>

          {/* Go Back Button - Redirects to Password Reset Page 1 */}
          <button
            onClick={() => navigate("/password-reset")}
            className="submit-button"
            style={{ backgroundColor: "red", marginTop: "10px" }}
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}
