import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 

export default function SignUp() {
  // State variables
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  // Function to handle form submission
  const handleSubmit  = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure the user enters an email before proceeding anything
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      // Make a POST request to check if the email already exists in the database (through api route)
      const response = await axios.post(`${window.location.origin}/api/checkEmail`, { email });
      setIsLoading(false);

      // Receive response after request
      if (response.status === 200) {
        // If email is available, alert the user and proceed to the verification page
        alert(response.data.message);
        navigate("/verify", { state: { email, redirectTo: "/filling-information" } });
      }

    } catch (error) {
      setIsLoading(false);

      // If email is already in use, show an error message
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
        alert("This email is already registered. Try logging in.");
      } else {
        // If the error is unknown, show a generic message
        alert(error.response.data.message);
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
        <h2 style={{ textAlign: "center" }}>
            Sign Up
        </h2>

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
          >
            Go Back
        </button>

        </form>
      </div>
    </div>
  );
}
