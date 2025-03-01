import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false); // Track verification step
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    // Redirect to verification page, passing the email and redirect target page which is signup2
    navigate("/verify", { state: { email, redirectTo: "/sign-up-2"} });
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
