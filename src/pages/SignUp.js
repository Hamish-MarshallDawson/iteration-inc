import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";                      // Import axios for making HTTP requests  
import "../App.css";
import Spinner from "../components/Spinner.js";  // Import LoadingSpinner component

export default function SignUp() {

//----------------------------------------State variables------------------------------------------------------

  // State variables
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

//----------------------------------------Form submission handling------------------------------------------------------

  // Function to handle form submission
  const handleSubmit  = async (e) => {
    e.preventDefault();   // Prevent default form submission behavior
    setIsLoading(true);   // Set state of spinner to true (spinning) as the form is submitting

    // Ensure the user enters an email before proceeding anything
    if (!email) {
      alert("Please enter your email.");
      setIsLoading(false);
      return;
    }

    // Email length validation
    if (email.length > 50) {
      alert("Your email has length greater than 50 characters, please enter a valid email.");
      setIsLoading(false);
      return;
    }

    try {
      // Make a POST request to check if the email already exists in the database (through api route)
      const response = await axios.post(`${window.location.origin}/api/user`, { 
        action: "checkEmail",
        email 
      });
      setIsLoading(false);

      // Receive response after request
      if (response.status === 200) {
        // If email is available, alert the user and proceed to the verification page
        alert(response.data.message);
        // Redirect to the verification page to simulate the process of email verification
        // Also pass along the email and the page to redirect to after verification
        navigate("/verify", { state: { email, redirectTo: "/filling-information" } });
      }

    } catch (error) {
      setIsLoading(false);

      // If email is already in use, show an error message
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        // If the error is unknown, show a generic message
        alert(error.response.data.message);
      } 
    }

  };
//--------------------------------------------------------------------------------------------------------------------------
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
