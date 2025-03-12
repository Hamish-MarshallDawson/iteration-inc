import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Plus, Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode"; 

import Card from "./ui/card.js";
import Button from "./ui/button.js";
import Switch from "./ui/Switch";
import CardContent from "./ui/cardContent";

import "../App.css";


export default function SmartDeviceGrid({ roomId }) {
  const navigate = useNavigate();
  
  const [devices, setDevices] = useState([]);               
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("lightbulb");
  const [showAddModal, setShowAddModal] = useState(false);
  const [userID, setUserID] = useState(null);
  const [roomID, setRoomID] = useState(null);


  useEffect(() => {
    // Get the room id
    setRoomID(roomId)

    // Extrat userid from jwt
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again");
        navigate("/");
        return;
      }
      const decoded = jwtDecode(token);
      setUserID(decoded.userId);
    } catch (error) {
      alert("Invalid token. Logging out.");
      localStorage.removeItem("token");
      navigate("/");
    }



  }, [navigate]);


  // For add device
  const addDevice = async () => {
    if (!deviceName.trim()) {
      alert("Device name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/api/addDevice`, {
        deviceName,
        deviceType,
        roomID,
        userID
      });

      if (response.status === 201) {
        setDevices([...devices, response.data.device]);
        setShowAddModal(false);
        setDeviceName("");
        setDeviceType("lightbulb");
      }
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device.");
    }
  };

  const toggleDevice = (id) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

  return (
    <div className="smart-device-grid-container p-6">
      <h2 className="section-title text-xl font-semibold text-orange-300 mb-4">
        Smart devices
      </h2>

      <div className="device-grid grid grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card
            key={device.id}
            className="device-card p-4 flex flex-col items-center bg-orange-400 rounded-lg shadow-lg"
          >
            <CardContent className="device-card-content text-center">
              <DeviceIcon
                type={device.type}
                className="device-icon text-black text-6xl mb-2"
              />
              <Switch
                checked={device.isOn}
                onCheckedChange={() => toggleDevice(device.id)}
                className="device-switch mb-2"
              />
              <p className="device-status text-sm text-black">
                {device.isOn ? "On" : "Off"}
              </p>
              <Button
                variant="ghost"
                className="settings-button mt-2 flex items-center gap-1"
              >
                <Settings size={16} /> Settings
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Device cARD */}
        <div onClick={() => setShowAddModal(true)}
          className="add-device-card"
        >
          <CardContent className="add-device-card-contentr">
            <Plus className="add-icon" />
            <p className="add-text">Add Device</p>
          </CardContent>
        </div>
      </div>

     {/* When clicked add device, modal window show up allow user to fill the form */}
     {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h3>Add New Device</h3>

            {/* Input device name*/}
            <div className="inputFields">
              <div className="input">
                <label>Device Name:</label>
                <input
                  type="text"
                  placeholder="Enter device name"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Select device type*/}
            <div className="inputFields">
              <div className="input">
                <label>Device Type:</label>
                <select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="input-select"
                >
                 <option value="coffee">Coffee Maker</option>
                  <option value="speaker">Speaker</option>
                  <option value="lightbulb">Lightbulb</option>
                  <option value="thermostat">Thermostat</option>
                  <option value="robot">Robot</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Save Device to database*/}
            <Button onClick={addDevice}>Save</Button>
            {/* Close modal*/}
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}


function DeviceIcon({ type, className }) {
  switch (type) {
    case "coffee":
      return <span className={`${className}`}>☕</span>;
    case "speaker":
      return <span className={`${className}`}>🔊</span>;
    case "lightbulb":
      return <span className={`${className}`}>💡</span>;
    case "thermostat":
      return <span className={`${className}`}>🌡️</span>;
    case "robot":
      return <span className={`${className}`}>🤖</span>;
    case "other":
      return <span className={`${className}`}>🐱</span>;
    default:
      return <span className={`${className}`}>❓</span>;
  }
}


