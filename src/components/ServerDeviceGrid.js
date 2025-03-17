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


// MY STUFF

// Unfortunately, we need this here as well. don't know if it's fixable
/*
Javascript that should be running on the client.
Handles devices on the user end.


TODO: (if you know what you're doing)
---------------------
getDevices() -          questionable priority considering vercel
                        should get ready for expo

updateDevice(device) -  way to get sample data. needed at some point

updateAllDevices() -    /\ /\ /\ see above /\ /\ /\
*/

// reduced functionality device manager class
// client doesn't need nearly as much info as the server
class clientDeviceManager {
  constructor() {
      // empty device psuedo-hashmap
      // should contain the same information as the server's one
      this.devices = {}
  }

  // contact the server to get any devices it has but this doesn't
  getDevices() {}

  // get fresh data from the server for a given device
  updateDevice(device) {}

  // get fresh data from the server for all devices in the network
  updateAllDevices() {}
}

// client version of device class made from a server-side device
// can be more generic as the client doesn't care if a device is real or simulated
// IMPORTANT!!! - if the server-side device class is changed, this must be changed too!
class clientDevice {
  constructor(device, dom) {
      // copy over all values from given server-side device
      this.data = device.data
      this.name = device.name
      this.deviceType = device.deviceType
      this.ID = device.ID
      this.location = device.location

      this.lastUpdated = Date.now()

      // a link to the DOM element representing the device in html
      this.domElement = dom
  }

  // retrieve data from the object
  // returns value on success, null on failure
  // not strictly neccessary, but good practice and may be required later
  getData(key) {
      if (this.data[""+key] !== undefined) {
          return this.data[""+key]
      }
      else {
          return null
      }
  }

  // put data into the object. will overwrite existing values
  // performs basic type checking for both key and value given
  // returns true on success, false on failure
  // not strictly neccessary, but good practice and may be required later
  setData(key,value) {
      if (typeof(key) == String && value !== undefined && value != null) {
          this.data[""+key] = value
          return true
      }
      else {
          return false
      }
  }

  setDomElement(newElement) {
      this.domElement = newElement
  }

}
// End of Massive javascript

export default function SmartDeviceGrid({ roomId }) {
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


  // MY STUFF
  const [clientDevices, setClientDevices] = useState([])

  useEffect( () => {
    async function getDevicesFromServer() {
      let response = await axios.post("http://localhost:5000/api/allDevices")
      if (response.status === 200) {
        console.log("REQUEST: getAllDevices SUCCESS");
        console.log("Response: "+JSON.stringify(response))
        console.log("Parsing JSON: "+response.data)
        console.log("parsed data: ")
        console.log(JSON.parse(response.data))// needs to be on a new line to format correctly
        // actual code
        // make response into array
        let outArr = []
        for (let device in JSON.parse(response.data)) {
          // needs device and dom
          console.log("RECIEVED DEVICE:")
          console.log(device)
          console.log(new clientDevice( (JSON.parse(response.data))[""+device],null))
          outArr[outArr.length]  = (JSON.parse(response.data))[""+device]
  
      }

        setClientDevices(outArr)
      }
    }
    getDevicesFromServer()
  },[])

  // Page auto loading content
  //----------------------------------------------------------------------------------------------------------------------------------------
  // This part responsible for get room ID and decode JWT to get user ID
  useEffect(() => {
    // Get the room id
    setRoomID(roomId);

    // // Extrat userid from jwt
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in again");
        //navigate("/"); DEBUG
        return;
      }
      const decoded = jwtDecode(token);
      setUserID(decoded.userId);
      setmachineID(decoded.machineId);
    } catch (error) {
      alert("Invalid token. Logging out.");
      localStorage.removeItem("token");
      //navigate("/"); DEBUG
    }
  }, [navigate]);

  // This part fetch devices when page load
  useEffect(() => {
    if (userID && roomID) {
      alert(`Fetching devices for Room ID: ${roomID} and User ID: ${userID}`);

      axios
        .post(`${window.location.origin}/api/device`, {
          action: "get",
          userID: userID,
          roomID: roomID,
          machineID,
        })
        .then((response) => {
          alert("Response Received");
          setDevices(response.data.devices || []);
        })
        .catch((error) => {
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
      const response = await axios.post(
        `${window.location.origin}/api/device`,
        {
          action: "add",
          deviceName,
          deviceType,
          roomID,
          userID,
          machineID,
        }
      );

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
    const newStatus = currentStatus === "Online" ? "Offline" : "Online";
    try {
      const response = await axios.post(
        `${window.location.origin}/api/device`,
        {
          action: "updateStatus",
          deviceID,
          newStatus,
          userID,
          machineID,
        }
      );

      if (response.status === 200) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.DeviceID === deviceID
              ? { ...device, Status: newStatus }
              : device
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
      const response = await axios.post(
        `${window.location.origin}/api/device`,
        {
          action: "updateName",
          deviceID: currentDevice.DeviceID,
          newDeviceName: updatedName,
          userID,
          machineID,
        }
      );

      if (response.status === 200) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
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
      const response = await axios.post(
        `${window.location.origin}/api/device`,
        {
          action: "remove",
          deviceID: currentDevice.DeviceID,
          userID,
          machineID,
        }
      );

      if (response.status === 200) {
        setDevices((prevDevices) =>
          prevDevices.filter(
            (device) => device.DeviceID !== currentDevice.DeviceID
          )
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
        {console.log("RENDERING: clientDevices:")}
        {console.log(clientDevices)}
        {clientDevices.map((device) => (
          <Card key={device.name} className="device-card">
            <h2>{device.name}</h2>
            <CardContent className="device-card-content">
              <DeviceIcon type={device.deviceType} className="device-icon" />
              <div className="device-status-wrapper">
                <Switch
                  isOn={device.data.status === "Online"} // Pass the correct status
                  onToggle={() =>
                    // toggleDeviceStatus(device.DeviceID, device.Status)
                    console.log("TODO: THIS SHOULD TOGGLE DEVICE STATUS")
                  } // Handle toggle
                  className="device-switch"
                />

                <p className="device-status">
                  {device.data.status === "Online" ? "On" : "Off"}
                </p>
              </div>

              <Button
                variant="ghost"
                className="settings-button"
                onClick={() => /*openSettingsModal(device)*/ console.log("TODO: THIS SHOULD OPEN THE SETTINGS")}
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
                  <option value="coffee">Coffee Maker</option>
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

            <Button onClick={() => energyUse(currentDevice)}>
              Log Energy Use
            </Button>
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
