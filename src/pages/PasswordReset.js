import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Temporary array act as user database
  const usersDatabase = [
    { email: "johnPork@a.com" },
    { email: "bombaclot@b.com" }
  ];

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if email exists in the database
    const userExists = usersDatabase.some(user => user.email === email);
    
    // If email does not exist, alert the user
    if (!userExists) {
      alert("This email is not registered.");
      return;
    }

    // Redirect to verification page with email and reset page as redirect target
    navigate("/verify", { state: { email, redirectTo: "/passwordReset2" } });
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

          <button type="submit" className="submit-button">
            Next
          </button>

          <button
            onClick={() => navigate("/")}
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
