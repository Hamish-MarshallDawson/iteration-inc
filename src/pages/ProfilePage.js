// Filename - pages/ProfilePage.js

import React from "react";
import "../css/profile-page.css"; // Ensure this imports your CSS file

const ProfilePage = () => {
  return (

    <div className="container">
      <h1 className="title">Profile</h1>
      <div className="card">
        <div className="profile-image">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="profile-icon"
          >
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M6 20v-2a6 6 0 0112 0v2"></path>
          </svg>
        </div>
        <h3>Full Name</h3>
        <p>Email goes here</p>
      </div>
    </div>
  );
};

export default ProfilePage;

