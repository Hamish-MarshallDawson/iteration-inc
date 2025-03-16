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


export default function SmartDeviceGrid({ roomId, allowedDeviceTypes = ["lightbulb", "coffee", "speaker", "thermostat", "robot", "other"] }) {
  const navigate = useNavigate();
  
  const [devices, setDevices] = useState([]);               
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("lightbulb");
  const [showAddModal, setShowAddModal] = useState(false);
  const [userID, setUserID] = useState(null);
  const [roomID, setRoomID] = useState(null);
  const [machineID, setmachineID] = useState();   


  // State variable for setting modal
  const [showSettingsModal, setShowSettingsModal] = useState(false); 
  const [currentDevice, setCurrentDevice] = useState(null); 
  const [updatedName, setUpdatedName] = useState(""); 


  // Page auto loading content
  //----------------------------------------------------------------------------------------------------------------------------------------
  // This part responsible for get room ID and decode JWT to get user ID
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
    setmachineID(decoded.machineId);
   } catch (error) {
     alert("Invalid token. Logging out.");
      localStorage.removeItem("token");
      navigate("/");
   }

  }, [navigate]);

  // This part fetch devices when page load
  useEffect(() => {
    if (userID && roomID) {
      alert(`Fetching devices for Room ID: ${roomID} and User ID: ${userID}`);
  
      axios.post(`${window.location.origin}/api/device`, {
        action: "get",
        userID: userID,
        roomID: roomID,
        machineID
      })
      .then(response => {
        //alert("Response Received");
        setDevices(response.data.devices || []);
      })
      .catch(error => {
        console.error("Error fetching devices:", error);
        alert("Failed to fetch devices.");
      });
    }
  }, [userID, roomID]); 

  // This part is for debugg purpose only
  useEffect(() => {
    console.log("Updated Devices List:", devices);
  }, [devices]);

  //----------------------------------------------------------------------------------------------------------------------------------------
  // This function responsible for add device  
  const addDevice = async () => {
    if (!deviceName.trim()) {
      alert("Device name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/api/device`, {
        action: "add",
        deviceName,
        deviceType,
        roomID,
        userID,
        machineID
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

  // This function responsible for change device status
  const toggleDeviceStatus = async (deviceID, currentStatus) => {
    const newStatus = (currentStatus === "Online" ? "Offline" : "Online");
    try {
      const response = await axios.post(`${window.location.origin}/api/device`, {
        action: "updateStatus",
        deviceID,
        newStatus,
        userID,
        machineID
      });
  
      if (response.status === 200) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.DeviceID === deviceID ? { ...device, Status: newStatus } : device
          )
        );
      }
    } catch (error) {
      console.error("Error updating device status:", error);
      alert("Failed to update device status.");
    }
  };

  // This function responsible for pop up setting widow
  const openSettingsModal = (device) => {
    setCurrentDevice(device);
    setUpdatedName(device.DeviceName);
    setShowSettingsModal(true);
  };

  // This function responsible for update device name
  const updateDeviceName = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/api/device`, {
        action: "updateName",
        deviceID: currentDevice.DeviceID,
        newDeviceName: updatedName,
        userID,
        machineID
      });

      if (response.status === 200) {
        setDevices(prevDevices =>
          prevDevices.map(device =>
            device.DeviceID === currentDevice.DeviceID
              ? { ...device, DeviceName: updatedName }
              : device
          )
        );
        setShowSettingsModal(false);
      }
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating device name:", error);
     
      alert("Failed to update device name.");
    }
  };

  // This function responsible for remove a device
  const removeDevice = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/api/device`, {
        action: "remove",
        deviceID: currentDevice.DeviceID,
        userID,
        machineID
      });

      if (response.status === 200) {
        setDevices(prevDevices =>
          prevDevices.filter(device => device.DeviceID !== currentDevice.DeviceID)
        );
        setShowSettingsModal(false);
      }
    } catch (error) {
      console.error("Error removing device:", error);
      alert("Failed to remove device.");
    }
  };

    // This function responsible for incrementing a devices energy amount
    const energyUse = async (device) => {
      try {
        const response = await axios.post(
          `${window.location.origin}/api/energy`,
          {
            action: "increment",
            deviceID: device.DeviceID,
            userID,
            machineID,
            deviceType: device.DeviceType,
          }
        );
  
        if (response.status === 200) {
          alert("Energy Logged Successfully!");
        }
      } catch (error) {
        console.error("Error incrementing energy:", error);
        alert("Failed to increment energy amount.");
      }
    };


  //----------------------------------------------------------------------------------------------------------------------------------------
  // This part is rendering part
  return (
    <div className="smart-device-grid-container">

      <h2 className="section-title">Smart devices</h2>

      <div className="device-grid">
        {devices.map((device) => (
          <Card key={device.DeviceName} className="device-card">
            <h2>{device.DeviceName}</h2>
            <CardContent className="device-card-content">
              <DeviceIcon type={device.DeviceType} className="device-icon" />
              <div className="device-status-wrapper">
                <Switch
                  isOn={device.Status === "Online"} // Pass the correct status
                  onToggle={() =>
                    toggleDeviceStatus(device.DeviceID, device.Status)
                  } // Handle toggle
                  className="device-switch"
                />

                <p className="device-status">
                  {device.Status === "Online" ? "On" : "Off"}
                </p>
              </div>

              <Button
                variant="ghost"
                className="settings-button"
                onClick={() => openSettingsModal(device)}
              >
                <Settings size={16} /> Settings
              </Button>
            </CardContent>
          </Card>
        ))}




      {/* Add Device cARD */}
      <div onClick={() => setShowAddModal(true)} className="add-device-card">
          <CardContent className="device-card-content">
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
                   {allowedDeviceTypes.map((type) => (
                     <option key={type} value={type}>
                       {type === "lightbulb" ? "Lightbulb" : 
                        type === "coffee" ? "Coffee Maker" :
                        type === "speaker" ? "Speaker" :
                        type === "thermostat" ? "Thermostat" :
                        type === "robot" ? "Robot" :
                        "Other"}
                     </option>
                   ))}
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


       {/* Settings Modal */}
       {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Device</h3>

            <div className="inputFields">
              <div className="input">
                <label>Device Name:</label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button onClick={updateDeviceName}>Save</Button>

            <Button onClick={removeDevice} className="bg-red-500">
              Remove
            </Button>
           
            <Button onClick={() => energyUse(currentDevice)}>Log Energy Use</Button>
            <Button onClick={() => setShowSettingsModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Function to return appropriate icon for device type
function DeviceIcon({ type, className }) {
  console.log("Device Type Received:", type);
  switch (type?.toLowerCase()) {
    case "coffee_machine":
      return <span className={`${className}`}>☕</span>;
    case "speaker":
      return <span className={`${className}`}>🔊</span>;
    case "light":
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
