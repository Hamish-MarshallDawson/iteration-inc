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
        label: 'Total Energy',
        data: [16, 4, 21, 9],
        fill: true,
        backgroundColor: 'rgba(13, 6, 40, 1)', // Last one is transparency
        borderRadius: 10, // Rounded corners for the bars
        tension: 0.1,
      },
      {
        label: "Lighting Energy",
        data: [12,2,17,4],
        fill: true,
        backgroundColor: 'rgba(75,196,196,1)',
        borderRadius: 10,
        tension: 0.1,
      },
      {
        label: "Heating Energy",
        data: [4,2,4,5],
        fill: true,
        backgroundColor: 'rgba(240,10,0,1)',
        borderRadius: 10,
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
        labels: {
        color: '#000000',
        },
      },
      title: {
        display: true,
        text: 'Recent Energy Usage',
        color: '#000000',
        font: {
          size: 22,
          weight: 'italic',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: "right",
        title: {
          display: true,
          text: 'kWh',
          color: '#000000',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#000000',
          font: {
            size: 16,
          },
        },
        grid: {
          color: 'white',
          lineWidth: 2,
        },
      },
      x: {
        title: {
          display: true,
          text: "Day",
          color: '#000000',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#000000',
          font: {
            size: 16,
          },
        },
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
    },
  };

  return <Bar data={data} options={options} />; }





const EnergyReport = () => {
  return (
    <div className="profile-container">

      <h1 style={{
        fontSize: 40,
        fontStyle: "italic",
        color: "#fca17d", /* Matches the card color */
        textAlign: "center",
        marginBottom: "2rem",
      }}>Energy Summary</h1>

      <div className="energy-card"
      style = {{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <BarGraph />
        <h3>Insert random latin text that probably means something, idk, i dont speak dead roman</h3>
      
        <button style = {{
          width: "16rem",
          height: "2rem",
          fontSize: 12
        }}>
          Download summary...
        </button>
      </div>
    </div>
  );
};

export default EnergyReport;
