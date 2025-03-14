// Filename - pages/about.js

import { useState, useEffect } from "react";
import axios from 'axios';

import { jwtDecode } from "jwt-decode"; 

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


const useEnergyData = (userEmail) => {
  //const [deviceData, setDeviceData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [userData, setUserData] = useState([]);


  useEffect(() => {
    
    // const token = localStorage.getItem("token");
    // // !!If it dont exist, means they exipired, then redirect them back to login, ask them to login again
    // if (!token) {
    //   navigate("/"); 
    //   return;
    // } try {
    //   // !!Decode the jwt token and store to the variable
    //   // const decoded = jwtDecode(token);
    //   // setUserID(decoded.userId);
    //   // setmachineID(decoded.machineId);
    // } catch (error) {
    //   console.error("Invalid token, logging out");
    // }


    const fetchData = async () => {
      
      // Queries for getting the energy usage data from the database
      
      
      // const query_device = `
      //   SELECT DATE(e.Timestamp) AS Date, SUM(e.EnergyUsed) AS TotalEnergyUsed
      //   FROM EnergyUse e
      //   JOIN Devices d ON e.DeviceID = d.DeviceID
      //   WHERE d.DeviceType = '${deviceType}' AND e.Timestamp >= NOW() - INTERVAL '7 days'
      //   GROUP BY DATE(e.Timestamp)
      //   ORDER BY Date ASC;
      // `;

      // const query_total = `
      //   SELECT DATE(e.Timestamp) AS Date, SUM(e.EnergyUsed) AS TotalEnergyUsed
      //   FROM EnergyUse e
      //   GROUP BY DATE(e.Timestamp)
      //   ORDER BY Date ASC;
      // `;

      // const query_user = `
      //   SELECT DATE(e.Timestamp) AS Date, SUM(e.EnergyUsed) AS TotalEnergyUsed
      //   FROM EnergyUse e
      //   JOIN Users u ON e.UserID = u.UserID
      //   WHERE u.email = '${userEmail}'
      //   GROUP BY DATE(e.Timestamp)
      //   ORDER BY Date ASC;
      // `;


      try {
        //const deviceResponse = await axios.post('/api/query', { query_device }); // Replace with your API endpoint
        //setDeviceData(deviceResponse.data);

        const data = await axios.post(`${window.location.origin}/api/query`); // Replace with your API endpoint
        
        /*
        const userResponse = await axios.post(`${window.location.origin}/api/query`, { query : query_user }); // Replace with your API endpoint
        console.log("User Data:", userResponse.data);
        setUserData(userResponse.data);*/

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userEmail]);

  return { totalData, userData };
};


const BarGraph = () => {

  const { totalData, userData } = useEnergyData("ldd1999@outlook.com")

  // Sample data for the chart
  const data = {
    labels: totalData.map((row) => row.Date),
    datasets: [
      {
        label: 'Total Energy Used',
        data: totalData.map((row) => row.TotalEnergyUsed),    // [16, 4, 21, 9],
        fill: true,
        backgroundColor: 'rgba(13, 6, 40, 1)', // Last one is transparency
        borderRadius: 10, // Rounded corners for the bars
        tension: 0.1,
      },
      {
        label: "Your Energy Used",
        data: userData.map((row) => row.TotalEnergyUsed), // [12,2,17,4],
        fill: true,
        backgroundColor: 'rgba(75,196,196,1)',
        borderRadius: 10,
        tension: 0.1,
      }
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