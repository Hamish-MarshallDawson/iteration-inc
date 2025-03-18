// Filename - pages/about.js

import React, { useState, useEffect, useRef  } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../App.css"; 

const AwardsPage = () => {

//----------------------------------------State variables------------------------------------------------------

  const [awards, setAwards] = useState([]);                        // List of all available awards
  const [unlockedAwards, setUnlockedAwards] = useState([]);         // List of all unlocked awards
  const [newUnlockedAwards, setNewUnlockedAwards] = useState([]);   // List of newly unlocked awards
  const [userID, setUserID] = useState(null);


//----------------------------------------Page auto loading contents------------------------------------------------------

  // Get the user ID from the token when the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      // !!Decode the jwt token and store to the variable
      const decoded = jwtDecode(token);
      setUserID(decoded.userId);
    } catch (error) {
      alert("Error decoding token");
    }
  }, []);


  // Fetch awards when the page loads
  useEffect(() => {
    if (!userID) return; 
    fetchAwards();
  }, [userID]);


  // Alert the user when they unlock a new award
  useEffect(() => {
    if (newUnlockedAwards.length > 0) {
      newUnlockedAwards.forEach((award) => {
        alert(`🎉 Congratulations! You've unlocked the "${award.Title}" award!`);
      });
      setNewUnlockedAwards([]);  
    }
  }, [newUnlockedAwards]);

//----------------------------------------Helper methods------------------------------------------------------

  // Fetch awards from the server
  const fetchAwards = async () => {
    try {
      //  Make a POST request to fetch awards
      const response = await axios.post(`${window.location.origin}/api/awards`,{userID: userID});
      setAwards(response.data.awards);                    // Set the list of all available awards
      setUnlockedAwards(response.data.unlockedAwards);    // Set the list of all unlocked awards
      setNewUnlockedAwards(response.data.newlyUnlocked);  // Set the list of newly unlocked awards
    } catch (error) {
      alert("Error fetching awards:", error);
    }
  };

//-----------------------------------------------------------------------------------------------------------------------
  return (
    <div className="awards-container">
      <h1 className="page-title">🏆 Awards & Achievements</h1>

      {/* Grid of Awards */}
      <div className="awards-grid">

        {/* Display each award */}
        {awards.map((award) => (
          <div 
            
            key={award.AwardID} 
            className={`award-card ${award.IsUnlocked ? "unlocked-award" : ""}`}
          >

            {/* Lock Icon for locked awards */}
            {!award.IsUnlocked && <div className="lock-icon"></div>}

            <img
              src={`/images${award.Icon}`} 
              className="award-icon"
            />

            <h2 className="award-title">{award.Title}</h2>

            <p className="award-description">{award.Description}</p>

            {/* Show "Earned On" for unlocked awards */}
            {award.IsUnlocked && (
              <p className="award-earned">🏆 Earned On: {new Date(award.DateEarned).toLocaleDateString()}</p>
            )}

            {!award.IsUnlocked && <div className="locked-label">Locked</div>}

            <span className={`award-level ${award.Level.toLowerCase()}`}>
              {award.Level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AwardsPage;
