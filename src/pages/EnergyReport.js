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


const useEnergyData = () => {

  const [totalData, setTotalData] = useState({});

  useEffect(() => {

    const fetchData = async () => {

      try {
        const response = await axios.post(`${window.location.origin}/api/query`);
        setTotalData(response.data);

        console.log("A - ",response.data)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return { totalData };
};


const BarGraph = () => {

  const { totalData } = useEnergyData()[0]

  
  console.log("B - ", totalData)

  console.log("C - ", Object.keys(totalData[0]))
  console.log("D - ", Object.values(totalData[0]))
  
  // data for the chart
  const data = {
    labels:  Object.keys(totalData[0]), //["10/03", "11/03", "12/03", "13/03", "14/03", "15/03", "16/03",],
    datasets: [
      {
        label: 'Total Energy Used',
        data: Object.values(totalData[0]), // [16, 6, 21, 9, 12, 8, 5], // totalData.map((row) => row.TotalEnergyUsed),    
        fill: true,
        backgroundColor: 'rgba(13, 6, 40, 1)', // Last one is transparency
        borderRadius: 10, // Rounded corners for the bars
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
        <h3>For more information, you may download the full energy report.</h3>
      
        <button style = {{
          width: "16rem",
          height: "2rem",
          fontSize: 12
        }}>
          Download report...
        </button>
      </div>
    </div>
  );
};

export default EnergyReport;