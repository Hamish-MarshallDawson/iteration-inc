import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import Card from "./ui/card.js";
import Button from "./ui/button.js";
import Switch from "./ui/Switch";
import CardContent from "./ui/cardContent";
import Spinner from "../components/Spinner.js";
import "../App.css";


export default function SmartDeviceGrid({
  // Room ID to fetch devices for
  roomId,
  // List of allowed device types
  allowedDeviceTypes = [
    "lightbulb",
    "coffee",
    "speaker",
    "thermostat",
    "robot",
    "other",
  ],
}) {

  //----------------------------------------State variables------------------------------------------------------
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  // State variable for automation rules
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [userType, setUserType] = useState(null);


  //------------------------------Page auto loading contents--------------------------------------------------------------------------------

  // This part responsible for get room ID and decode JWT to get user ID
  useEffect(() => {
    // Get the room id
    setRoomID(roomId);
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
      setUserType(decoded.userType);
    } catch (error) {
      alert("Invalid token. Logging out.");
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);


  // This part fetch devices when page load
  useEffect(() => {
    if (userID && roomID) {
      // Fetch devices for the room and user
      axios.post(`${window.location.origin}/api/device`, {
        action: "get",
        userID: userID,
        roomID: roomID,
        machineID,
      })
        .then((response) => {
          //alert("Response Received");
          setDevices(response.data.devices || []);  // Set the devices to the response data
        })
        .catch((error) => {
          console.error("Error fetching devices:", error);
          alert("Failed to fetch devices.");
        });
    }
  }, [userID, roomID]);



  //---------------------------------------Helper methods-----------------------------------------------------------------------------

  //-------------------------------------------For manage automation rules-------------------------------------------

  const openScheduleModal = (device) => {
    setIsLoading(true);

    // Check if the user is allowed to modify schedules
    if (userType !== "Home_Manager" && userType !== "Admin") {
      alert("Only Managers and Admins can modify schedules.");
      setIsLoading(false);
      return;
    }
    
    setSelectedDevice(device);
    setShowScheduleModal(true);
  
    // Fetch the existing schedule from API
    axios.post(`${window.location.origin}/api/device`, {
      action: "fetchSchedule",
      deviceID: device.DeviceID,
      userID,
    })
    .then((response) => {
      setIsLoading(false);
      // Set the schedule to the response data, or default values if no schedule exists
      setSchedule(response.data.schedule || { frequency: "Weekly", startTime: "", endTime: "" });
    })
    .catch((error) => {
      setIsLoading(false);
      console.error("Error fetching schedule:", error);
      alert("Failed to fetch schedule.");
    });
  };

  const updateSchedule = async () => {

    if (!selectedDevice) return; // If no device is selected, return

    try {
      // Make a POST request to update the schedule
      const response = await axios.post(`${window.location.origin}/api/device`, {
        action: "updateSchedule",
        deviceID: selectedDevice.DeviceID,
        userID,
        frequency: schedule.frequency,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      });
  
      if (response.status === 200) {
        alert("Schedule updated successfully!");
        setShowScheduleModal(false);
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };


  //-------------------------------------------For manage devices-----------------------------------------------

  // This function responsible for add device
  const addDevice = async () => {
    // Check if device name is empty
    if (!deviceName.trim()) {
      alert("Device name cannot be empty.");
      return;
    }
    // Check if device name is too long
    if (deviceName.length >= 30) {
      alert("Device name cannot be longger than 30 characters.");
      return;
    }
    setIsLoading(true);
    try {
      // Make a POST request to add a new device
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

      // If the device is added successfully, add it to the list of devices that displays on the page
      if (response.status === 201) {
        setDevices([...devices, response.data.device]);
        setShowAddModal(false);
        // Reset the device name and type
        setDeviceName("");
        setDeviceType("lightbulb");
        alert("Device added successfully.");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Failed to add device.");
    }
  };


  // This function responsible for toggle device status
  const toggleDeviceStatus = async (deviceID, currentStatus) => {
    // Toggle the status
    const newStatus = currentStatus === "Online" ? "Offline" : "Online";
    try {
      setIsLoading(true);
      // Make a POST request to update the device status
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

      // If the status is updated successfully, find this devices in the list of devices that displays on the page, the update the status
      if (response.status === 200) {
        setDevices((prevDevices) =>
          // Map through the devices and update the status of the device with the matching device ID
          prevDevices.map((device) =>
            device.DeviceID === deviceID
              ? { ...device, Status: newStatus }
              : device
          )
        );
        alert(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Failed to toggle device status.");
    }
  };


  // This function responsible for pop up setting modal widow
  const openSettingsModal = (device) => {
    // Set the current device and show the settings modal
    setCurrentDevice(device);
    setUpdatedName(device.DeviceName);
    setShowSettingsModal(true);

    axios.post(`${window.location.origin}/api/device`, {
      action: "fetchSchedule",
      deviceID: device.DeviceID,
      userID,
    })
    .then((response) => {
      setSchedule(response.data.schedule || { frequency: "Weekly", startTime: "", endTime: "" });
    })
    .catch((error) => {
      console.error("Error fetching schedule:", error);
      alert("Failed to fetch schedule.");
    });
  };


  // This function responsible for update device name
  const updateDeviceName = async () => {
    try {
      // Check if the updated name is empty
      if (!updatedName.trim()) {
        alert("Device name cannot be empty.");
        return;
      }
      // Check if the updated name is too long
      if (updatedName.length >= 30) {
        alert("Device name cannot be longger than 30 characters.");
        return;
      }
      setIsLoading(true);
      // Make a POST request to update the device name
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

      // If the device name is updated successfully, find this device in the list of devices that displays on the page, then update the name
      if (response.status === 200) {
        setDevices((prevDevices) =>
          // Map through the devices and update the name of the device with the matching device ID
          prevDevices.map((device) =>
            device.DeviceID === currentDevice.DeviceID
              ? { ...device, DeviceName: updatedName }
              : device
          )
        );
        // Close the settings modal
        setShowSettingsModal(false);
      }
      alert(response.data.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating device name:", error);

      alert("Failed to update device name.");
    }
  };

  // This function responsible for remove a device
  const removeDevice = async () => {
    try {
      setIsLoading(true);
      // Make a POST request to remove the device
      const response = await axios.post(
        `${window.location.origin}/api/device`,
        {
          action: "remove",
          deviceID: currentDevice.DeviceID,
          userID,
          machineID,
        }
      );

      // If the device is removed successfully, filter out the device from the list of devices that displays on the page
      if (response.status === 200) {
        setDevices((prevDevices) =>
          // Filter out the device with the matching device ID
          prevDevices.filter(
            (device) => device.DeviceID !== currentDevice.DeviceID
          )
        );
        setShowSettingsModal(false);
        alert(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      alert("Failed to remove device.");
    }
  };

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

  //-------------------------------------------For simulate energy usage-----------------------------------------------

  // This function responsible for incrementing a devices energy amount
  const energyUse = async (device) => {
    try {
      setIsLoading(true);
      // Make a POST request to increment the energy amount
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
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error incrementing energy:", error);
      alert("Failed to increment energy amount.");
    }
  };

  //-----------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="smart-device-grid-container">
      <h2 className="section-title">Smart Devices</h2>

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
              {isLoading && <Spinner />}
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
                      {type === "lightbulb"
                        ? "Lightbulb"
                        : type === "coffee"
                          ? "Coffee Maker"
                          : type === "speaker"
                            ? "Speaker"
                            : type === "thermostat"
                              ? "Thermostat"
                              : type === "robot"
                                ? "Robot"
                                : "Other"}
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

            {schedule && schedule.Frequency ? (
              <div>
                <h4>Current Schedule:</h4>
                <p><strong>Frequency:</strong> {schedule.Frequency}</p>
                <p><strong>Start Time:</strong> {schedule.StartTime ? new Date(schedule.StartTime).toLocaleString() : "Not Set"}</p>
                <p><strong>End Time:</strong> {schedule.EndTime ? new Date(schedule.EndTime).toLocaleString() : "Not Set"}</p>
              </div>
            ) : (
              <p>No schedule assigned to this device.</p>
            )}

            <Button onClick={updateDeviceName}>Save</Button>

            <button onClick={removeDevice} style={{ backgroundColor: "#f44336" }}>
              Remove
            </button>

            <button onClick={() => energyUse(currentDevice)} style={{ backgroundColor: "#007BFF" }} >
              Log Energy Use
            </button>

            <button onClick={() => openScheduleModal(currentDevice)} style={{ backgroundColor: "#007BFF" }}>
              Modify Schedule
            </button>
            <Button onClick={() => setShowSettingsModal(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Modify Schedule for {selectedDevice?.DeviceName}</h3>

            <div className="inputFields">
              <label>Frequency:</label>

              <select
                value={schedule?.frequency || "Weekly"}  
                onChange={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
              >
                {["Once", "Daily", "Weekly", "Monthly"].map((freq) => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            <div className="inputFields">
              <label>Start Time:</label>
              <input
                type="datetime-local"
                value={schedule.startTime || ""}
                onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
              />
            </div>

            <div className="inputFields">
              <label>End Time:</label>
              <input
                type="datetime-local"
                value={schedule.endTime  || ""}
                onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
              />
            </div>

            <Button onClick={updateSchedule}>Save</Button>
            <Button onClick={() => setShowScheduleModal(false)}>Cancel</Button>
          </div>
        </div>
      )}




    </div>
  );
}
