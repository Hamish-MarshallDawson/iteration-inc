// Filename - pages/about.js

import React from "react";

import "../App.css";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  // Sample data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
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
        text: 'Sample Line Chart',
      },
    },
  };

  return <Line data={data} options={options} />; }





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
