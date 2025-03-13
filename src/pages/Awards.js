// Filename - pages/about.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"; 

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);

  // Fetch awards when the page loads
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/awards`);
        setAwards(response.data.awards);
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };

    fetchAwards();
  }, []);

  return (
    <div className="awards-container">
      <h1 className="page-title">🏆 Awards & Achievements</h1>

      {/* Grid of Awards */}
      <div className="awards-grid">
        {awards.map((award) => (
          <div key={award.AwardID} className="award-card">

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
