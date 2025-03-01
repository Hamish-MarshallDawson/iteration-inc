import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Card from "./ui/card.js";
import Button from "./ui/button.js";
import Switch from "./ui/Switch";
import CardContent from "./ui/cardContent";

import { Plus, Settings } from "lucide-react";

import "../App.css";

export default function SmartDeviceGrid() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Coffee Maker", type: "coffee", isOn: false },
    { id: 2, name: "Speaker", type: "speaker", isOn: false },
    { id: 3, name: "Lightbulb", type: "lightbulb", isOn: false },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("lightbulb");

  const addDevice = () => {
    if (!deviceName.trim()) {
      alert("Device name cannot be empty.");
      return;
    }

    const newDevice = {
      id: Date.now(),
      name: deviceName,
      type: deviceType, 
      isOn: false,
    };

    setDevices([...devices, newDevice]);
    setShowAddModal(false);
    setDeviceName("");
    setDeviceType("lightbulb");

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
          className="add-device-card p-4 flex flex-col items-center justify-center bg-orange-400 rounded-lg shadow-lg cursor-pointer hover:bg-orange-500 transition"
        >
          <CardContent className="add-device-card-content text-center">
            <Plus className="add-icon text-black text-6xl mb-2" />
            <p className="add-text text-sm text-black">Add Device</p>
          </CardContent>

        </div>
      </div>

     {/* When clicked add device, modal window show up allow user to fill the form */}
     {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <h3>Add New Device</h3>

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
                </select>
              </div>
            </div>

            <Button onClick={addDevice}>Save</Button>
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Function to return appropriate icon for device type
function DeviceIcon({ type, className }) {
  switch (type) {
    case "coffee":
      return <span className={`${className}`}>☕</span>;
    case "speaker":
      return <span className={`${className}`}>🔊</span>;
    case "lightbulb":
      return <span className={`${className}`}>💡</span>;
    default:
      return <span className={`${className}`}>❓</span>;
  }
}
