// Filename - pages/about.js

import React, { useState, useEffect, useRef  } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../App.css"; 

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
  const [unlockedAwards, setUnlockedAwards] = useState([]);
  const [newUnlockedAwards, setNewUnlockedAwards] = useState([]);

  const alertedAwardsRef = useRef(new Set());

  const [userID, setUserID] = useState(null);

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

  useEffect(() => {
    newUnlockedAwards.forEach((award) => {
      if (!alertedAwardsRef.current.has(award.AwardID)) { 
        alert(`🎉 Congratulations! You've unlocked the "${award.Title}" award!`);
        alertedAwardsRef.current.add(award.AwardID); 
      }
    });
  }, [newUnlockedAwards]);


  const fetchAwards = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/api/awards`,{userID: userID});
      setAwards(response.data.awards);
      setUnlockedAwards(response.data.unlockedAwards);
      setNewUnlockedAwards(response.data.newlyUnlocked);
    } catch (error) {
      console.error("Error fetching awards:", error);
    }
  };

  return (
    <div className="awards-container">
      <h1 className="page-title">🏆 Awards & Achievements</h1>

      {/* Grid of Awards */}
      <div className="awards-grid">
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
