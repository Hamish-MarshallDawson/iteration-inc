// Filename - pages/about.js

import { useState, useEffect } from "react";
import axios from 'axios';

import { Bar } from 'react-chartjs-2';

import "../App.css";

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



const useEnergyData = (day, month) => {
  const [deviceData, setDeviceData] = useState([]);
  const [userData, setUserData] = useState([]);
  const date = `2025-${month}-${day}`;


  useEffect(() => {
    const fetchData = async () => {
      
      // Queries for getting the energy usage data from the database
      const query_device = `
      SELECT d.DeviceType, SUM(e.EnergyUsed) AS TotalEnergyUsed
      FROM EnergyUse e
      JOIN Devices d ON e.DeviceID = d.DeviceID
      WHERE DATE(e.Timestamp) = '${date}'
      GROUP BY d.DeviceType;
    `; // this one gets all data on a certain day, grouped by device
    const query_user = `
      SELECT u.FirstName, u.LastName, SUM(e.EnergyUsed) AS TotalEnergyUsed
      FROM EnergyUse e
      JOIN Users u ON e.UserID = u.UserID
      WHERE DATE(e.Timestamp) = '${date}'
      GROUP BY u.UserID;
    `; // this one gets all data on a certain day, grouped by user


    try {
      const deviceResponse = await axios.post('/api/query', { query_device }); // Replace with your API endpoint
      setDeviceData(deviceResponse.data);
      const userResponse = await axios.post('/api/query', { query_user }); // Replace with your API endpoint
      setUserData(userResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    };

    fetchData();
  }, [month, day]);

  return deviceData, userData;
};


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
