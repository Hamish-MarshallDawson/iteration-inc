// Filename - pages/about.js

import React from "react";

import "../App.css";

import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = () => {
  // Sample data for the chart
  const data = {
    labels: ['10/09', '11/09', '12/09', '13/09'],
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: [16, 4, 21, 9],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recent Energy Usage',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kWh',
        },
      },
    },
  };

  return <Bar data={data} options={options} />; }





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
        <BarGraph />
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
