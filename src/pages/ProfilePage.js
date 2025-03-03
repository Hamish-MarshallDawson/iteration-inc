// Filename - pages/ProfilePage.js

import React, { useState } from "react";
import { Link } from "react-router-dom";

import Spinner from "../components/Spinner.js"; // Import LoadingSpinner component
import "../App.css";

const ProfilePage = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const changeName = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setIsLoading(false);
  };

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
      <form onSubmit={changeName}>
        <div className="inputFields">
        <div className="input">
            <label>Update Name</label>
            <input
              style={{marginBottom:"0"}}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        <button style = {{
          width: "4rem",
          height: "2rem",
          marginTop: "0",
          marginBottom: "2rem",
        }} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
          <div className="input">
            <label>Update Email</label>
            <input
              type="email"
              style={{marginBottom:"0"}}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button style = {{
          width: "4rem",
          height: "2rem",
          marginTop: "0",
          marginBottom: "1rem",
        }} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
        {isLoading && <Spinner />} {/* Use the Spinner component here */}
      </form>
      </div>


    {/* Log Out Button */}
    <div>
      <Link to="/">
            <button>Log Out</button>
      </Link>
    </div>

    </div>
  );
};

export default ProfilePage;