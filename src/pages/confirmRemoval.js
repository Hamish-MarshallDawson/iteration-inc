import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Spinner from "../components/Spinner.js"; 
import { jwtDecode } from "jwt-decode"; 


export default function ConfirmUpdateEmail() {
  const location = useLocation();
  const newEmail = location.state?.email || "";  
  const navigate = useNavigate();

//----------------------------------------Page auto loading contents------------------------------------------------------

  // Check if user already logged in when page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/profile"); 
        alert("Please Log off and Log in again")
        return;
    }
    try {
        // Decode the token
        const decoded = jwtDecode(token);
        // Get the current email from the token
        const currentEmail = decoded.email;

        // Update the email in the database
        const removeProfile = async () => {   
            try {

              // Make a POST request to update the email in the database
              const response = await axios.post(`${window.location.origin}/api/user`, {
                  action: "removeProfile",
                  email: currentEmail,
              });

              // If the email is updated successfully, alert the user and redirect to the login page
              if (response.status === 200) {
                  alert("Account Delete");
                  // Remove the old token from local storage
                  localStorage.removeItem("token");  
                  navigate("/"); 
              }
            } catch (error) {
                  alert("Failed to remove account. Try again.");
                  navigate("/profile");
            }
        };
        removeProfile();

    ;}catch (error) {
        alert("Invalid token, logging out");
        localStorage.removeItem("token");
        navigate("/");
    }

  }, [navigate, newEmail]);

//------------------------------------------------------------------------------------------------------

  return (
    <div className="login-container">
      <img 
        src="/images/iterationincv3.png" 
        alt="Snake logo" 
        className="snake-logo" 
      />

      <div className="login">
        <h2 style={{ textAlign: "center" }}>Updating Email...</h2>
        <Spinner />
      </div>

    </div>
  );
} 
