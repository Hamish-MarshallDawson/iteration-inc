// Filename - pages/ProfilePage.js

import React, { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";

// !!Import jwtDecode to decode jwt
import { jwtDecode } from "jwt-decode"; 

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();


  // !!Extract email from JWT token when page is load
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   // !!If it dont exist, means they exipired, then redirect them back to login, ask them to login again
  //   if (!token) {
  //     navigate("/"); 
  //     return;
  //   }
  //   try {
  //     // !!Decode the jwt token and store to the variable
  //     const decoded = jwtDecode(token);
  //     setEmail(decoded.email);
  //     setFirstName(decoded.firstName);
  //     setLastName(decoded.lastName);
  //     setUserType(decoded.userType);
  //   } catch (error) {
  //     console.error("Invalid token, logging out");
  //     localStorage.removeItem("token");
  //     // Redirect to login if token is invalid
  //     navigate("/");
  //   }
  // }, [navigate]);

  // Handle logout, by clear token and go back to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  // Handle email update, by redirect to verify page and further update-email page
  const handleUpdateEmail = () => {
    navigate("/verify", { state: { email, redirectTo: "/updateEmail" } });
  };

  // Handle password, by redirect to password reset page
  const handleUpdatePassword = () => {
    navigate("/verify", { state: { email, redirectTo: "/passwordReset2" } });
  };

  return (
    <div className="profile-container">

      <h1 style={{
        fontSize: 40,
        fontStyle: "italic",
        color: "#fca17d", /* Matches the card color */
        textAlign: "center",
        marginBottom: "2rem",
      }}>Profile</h1>

      {/* Profile Info */}
      <div className="profile-card"
      style = {{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <div className="profile-image">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style = {{
              width: 40,
              height: 40,
            }}
          >
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M6 20v-2a6 6 0 0112 0v2"></path>
          </svg>
        </div>



        <h2>{firstName} {lastName}</h2>
        <h3>{email}</h3>
        <h3>User Type: {userType}</h3>


      </div>

    {/* Update Email & Password Buttons */}
    <div className="profile-card"
        style={{
          marginTop: "2rem",
    }}>
      <button onClick={handleUpdateEmail}>
        Update Email
      </button>

      <button onClick={handleUpdatePassword}>
        Update Password
      </button>
    </div>

    {/* Log Out Button */}
    <div>
      <Link to="/">
            <button onClick={handleLogout}>
              Log Out
            </button>
      </Link>
    </div>

    </div>
  );
};

export default ProfilePage;