// Filename - pages/ProfilePage.js

import React from "react";

import { Link } from "react-router-dom";

import "../css/profile-page.css";

import Card from "../components/ui/card.js";
import Button from "../components/ui/button.js";
// import CardContent from "../components/ui/cardContent.js";

// <Card className="w-[300px] h-[180px] bg-[#fca17d] rounded-lg shadow-md flex flex-col items-center justify-center text-center mt-[50px] p-[15px]">

const ProfilePage = () => {
  return (
    <div className="container">

      <h1 className="title">Profile</h1>

      {/* Profile Info */}
      <Card className="card">
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
      </Card>

    {/* Update Profile */}
      <Card className="card">
        <h2 className="text-lg font-semibold mb-2">Update Profile</h2>
        <Button className="">Update Name</Button>
        <Button className="">Update Contact Info</Button>
      </Card>

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

