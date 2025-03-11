import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 

export default function PasswordReset() {
  // State variables
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure the user enters an email before proceeding anything
    if (!email) {
      alert("Please enter your email.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Make a POST request to check if the email already exists in the database (through api route)
      const response = await axios.post(`${window.location.origin}/api/checkEmail`, { email });

      // Checkemail api succeeds when email dont exist
      alert("Email is not registered.");
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.status === 400) {
        // If API returns a 400 error, it means the email exists
        alert("Email exist, proceeding to verification.");
        navigate("/verify", { state: { email, redirectTo: "/passwordReset2" } });
      } else {
        // If an unknown error occurs, show a general message
        alert("Something went wrong. Please try again.");
      }
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
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
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
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Loading..." : "Next"}
          </button>
          {isLoading && <Spinner />}

          <button
            onClick={() => navigate("/")}
            className="submit-button"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}
