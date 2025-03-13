import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 

export default function UpdateEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // Call checkEmail API to verify if the email is already taken
        const response = await axios.post(`${window.location.origin}/api/user`, { 
          action: "checkEmail",
          email: newEmail 
        });
        setIsLoading(false);
  
        if (response.status === 200) {
          // If email is available, redirect to verification page
          navigate("/verify", { state: { email: newEmail, redirectTo: "/confirmUpdateEmail" } });
        }
  
    } catch (error) {
        setIsLoading(false);
        if (error.response && error.response.status === 400) {
            // If API returns a 400 error, it means the email exists
            alert("This email is already registered.");
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
        <h2 style={{ textAlign: "center" }}>Update Email</h2>

        <form onSubmit={handleSubmit}>
          <div className="inputFields">
            <div className="input">
              <label>New Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Checking..." : "Next"}
          </button>
          {isLoading && <Spinner />}

        </form>
      </div>
    </div>
  );
}
