import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 

export default function SignUpStep2() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from previous page where it redirected from
  const email = location.state?.email || "";

  // State for form inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 

  // State for spinner
  const [isLoading, setIsLoading] = useState(false);

  // Validation function for passwords
  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); // At least 8 characters, 1 uppercase letter, 1 number
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if two entreis of passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check if user's name is valid
    if (firstName.length < 2 || lastName.length < 2) {
      alert("First and Last Name must be at least 2 characters long.");
      return;
    }

    // Check if password is valid by call validation function 
    if (!isValidPassword(password)) {
      alert(
        "Password must be at least 8 characters, contain a number, and an uppercase letter."
      );
      return;
    }


    // Everything is valid, then store them to database, and redirect to profile page
    try {

      // Send user data to backend for database insertion
      const response = await axios.post(`${window.location.origin}/api/registerUser`, {
        firstName,
        lastName,
        email,
        password,
      });

      setIsLoading(false);

      // Receive response after request
      if (response.status === 201) {
        // If insertion success, then prompt to user and redirect to profile page
        alert("Account successfully created!");
        navigate("/profile");
      }
    } catch (error) {
      setIsLoading(false);
      // Else just show an error message
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
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
