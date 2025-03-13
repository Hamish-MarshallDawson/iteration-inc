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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/profile"); 
        alert("Please Log off and Log in again")
        return;
    }
    try {
        const decoded = jwtDecode(token);
        const currentEmail = decoded.email;
  
        const updateEmail = async () => {   
            try {
                const response = await axios.post(`${window.location.origin}/api/user`, {
                    action: "updateEmail",
                    oldEmail:currentEmail,
                    newEmail,
                });
                if (response.status === 200) {
                    alert("Email updated successfully");
                    alert("Please Log in again with the new email");
                    localStorage.removeItem("token");  
                    navigate("/"); 
                }
            } catch (error) {
                    alert("Failed to update email. Try again.");
                    navigate("/profile");
            }
        };
        updateEmail();

    ;}catch (error) {
        console.error("Invalid token, logging out");
        localStorage.removeItem("token");
        navigate("/");
    }


  }, [navigate, newEmail]);

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
