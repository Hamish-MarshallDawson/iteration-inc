// Filename - pages/ProfilePage.js

import React from "react";

import { Link } from "react-router-dom";

// import "../css/profile-page.css";
import "../App.css";

import Card from "../components/ui/card.js";
import Button from "../components/ui/button.js";
// import CardContent from "../components/ui/cardContent.js";

// <Card className="w-[300px] h-[180px] bg-[#fca17d] rounded-lg shadow-md flex flex-col items-center justify-center text-center mt-[50px] p-[15px]">

const ProfilePage = () => {
  return (
    <div className="profile-container">

      <h1 style={{
        fontSize: 36,
        fontStyle: "italic",
        color: "#fca17d", /* Matches the card color */
        textAlign: "center",
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
        <h2>Full Name</h2>
        <h3>Email goes here</h3>
      </div>

    {/* Update Profile */}
      <div className="profile-card"
      style={{
        marginTop: "2rem",
      }}>
        <h2 className="text-lg font-semibold mb-2">Update Profile</h2>
        <Button className="">Update Name</Button>
        <Button className="">Update Contact Info</Button>
      </div>

      {/* Log Out Button */}
      <div>
        <Link to="/">
            <Button className="w-full bg-red-500 hover:bg-red-600">Log Out</Button>
        </Link>
      </div>

    </div>
  );
};

export default ProfilePage;

