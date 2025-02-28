import { useState } from "react";
import Card from "./ui/card.js";
import Button from "./ui/button.js";
import Switch from "./ui/Switch";
import CardContent from "./ui/cardContent";

import { Plus, Settings } from "lucide-react";

export default function SmartDeviceGrid() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Coffee Maker", type: "coffee", isOn: false },
    { id: 2, name: "Speaker", type: "speaker", isOn: false },
    { id: 3, name: "Lightbulb", type: "lightbulb", isOn: false },
  ]);

  const addDevice = () => {
    const newDevice = {
      id: Date.now(),
      name: "New Device",
      type: "lightbulb", // Default type
      isOn: false,
    };
    setDevices([...devices, newDevice]);
  };

  const toggleDevice = (id) => {
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, isOn: !device.isOn } : device
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-orange-300 mb-4">
        Smart devices
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {devices.map((device) => (
          <Card
            key={device.id}
            className="p-4 flex flex-col items-center bg-orange-400 rounded-lg shadow-lg"
          >
            <CardContent className="text-center">
              <DeviceIcon
                type={device.type}
                className="text-black text-6xl mb-2"
              />
              <Switch
                checked={device.isOn}
                onCheckedChange={() => toggleDevice(device.id)}
                className="mb-2"
              />
              <p className="text-sm text-black">{device.isOn ? "On" : "Off"}</p>
              <Button variant="ghost" className="mt-2 flex items-center gap-1">
                <Settings size={16} /> Settings
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Device Card */}
        <Card
          onClick={addDevice}
          className="p-4 flex flex-col items-center justify-center bg-orange-400 rounded-lg shadow-lg cursor-pointer hover:bg-orange-500 transition"
        >
          <CardContent className="text-center">
            <Plus className="text-black text-6xl mb-2" />
            <p className="text-sm text-black">Add Device</p>
          </CardContent>
        </Card>
      </div>
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
