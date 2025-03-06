import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function SignUpStep2() {
  const location = useLocation();

  // Get email from previous page
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const navigate = useNavigate();
  const ADMIN_ACCESS_CODE = "ABCDE12345"; //  Preset 10-digit access code from Admin

  const isValidPhoneNumber = (contact) => {
    return /^[0-9]{10,15}$/.test(contact); // Allows only numbers, 10-15 digits
  };
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); // At least 8 characters, 1 uppercase letter, 1 number
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Check if password is valid
    if (!isValidPassword(password)) {
      alert(
        "Password must be at least 8 characters, contain a number, and an uppercase letter."
      );
      return;
    }
    // Check if username is valid
    if (username.length < 3 || username.length > 15) {
      alert("Username must be between 3 and 15 characters.");
      return;
    }
    // Check if contact info is valid
    if (!isValidPhoneNumber(contact)) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }
    // Check if access code is valid
    if (accessCode !== ADMIN_ACCESS_CODE) {
      alert("Invalid access code.");
      return;
    }

    // Everything is correct, redirect to profile page
    alert("Account successfully created!");
    navigate("/profile");
  };

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

            <div className="input">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <label>Contact Info:</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            <div className="input">
              <label>Access Code:</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>

          <button
            onClick={() => navigate("/sign-up")}
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
