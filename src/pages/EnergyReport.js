// Filename - pages/about.js

import React from "react";

import "../App.css";

const EnergyReport = () => {
  return (
    <div className="profile-container">

      <h1 style={{
        fontSize: 30,
        color: "#fca17d", /* Matches the card color */
        textAlign: "center",
      }}>Energy Summary</h1>

      <div className="profile-card"
      style = {{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <h2 style={{
        fontStyle: "italic"
        }}>Recent Usage</h2>
        <h3>*Insert graph here*</h3>
        <h3>Insert random latin text that probably means something, idk, i dont speak dead roman</h3>
      
        <button style = {{
          width: "16rem",
          height: "2rem",
          fontSize: 12
        }}>
          "Download summary..."
        </button>
      </div>
    </div>
  );
};

export default EnergyReport;
