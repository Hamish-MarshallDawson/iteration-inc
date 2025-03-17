// Filename - pages/ProfilePage.js

import React, { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios"; 

// !!Import jwtDecode to decode jwt
import { jwtDecode } from "jwt-decode"; 

/*
user name constrain
password constrain
device type constrain - not null	
recoms - match energy goal
awards - match energy goal
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⢀⣴⠟⠉⠀⠀⠀⠈⠻⣦⡀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣀⢀⣾⠿⠻⢶⣄⠀⠀⣠⣶⡿⠶⣄⣠⣾⣿⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⢻⣿⣿⡿⣿⠿⣿⡿⢼⣿⣿⡿⣿⣎⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠉⠛⢛⣛⡉⠀⠀⠙⠛⠻⠛⠑⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣧⣤⣴⠿⠿⣷⣤⡤⠴⠖⠳⣄⣀⣹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣀⣟⠻⢦⣀⡀⠀⠀⠀⠀⣀⡈⠻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡿⠉⡇⠀⠀⠛⠛⠛⠋⠉⠉⠀⠀⠀⠹⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠈⠑⠪⠷⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣾⣿⣿⣿⣦⣼⠛⢦⣤⣄⡀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠑⠢⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠲⠖⠛⠻⣿⡿⠛⠉⠉⠻⠷⣦⣽⠿⠿⠒⠚⠋⠉⠁⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣾⠛⠁⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⠀⠀⠀
⠀⠀⠀⠀⣰⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀
⠀⠀⠀⣰⣿⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣧⣄⠀⠀⠀⠀⠀⠀⢳⡀⠀
⠀⠀⠀⣿⡾⢿⣀⢀⣀⣦⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⣫⣿⡿⠟⠻⠶⠀⠀⠀⠀⠀⢳⠀
⠀⠀⢀⣿⣧⡾⣿⣿⣿⣿⣿⡷⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⢀⡴⢿⣿⣧⠀⡀⠀⢀⣀⣀⢒⣤⣶⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⡾⠁⠙⣿⡈⠉⠙⣿⣿⣷⣬⡛⢿⣶⣶⣴⣶⣶⣶⣤⣤⠤⠾⣿⣿⣿⡿⠿⣿⠿⢿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⣸⠃⠀⠀⢸⠃⠀⠀⢸⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⠟⡉⠀⠀⠀⠈⠙⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇
⠀⣿⠀⠀⢀⡏⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠛⠉⠁⠀⠀⠀⠀⠀⠉⠠⠿⠟⠻⠟⠋⠉⢿⣿⣦⡀⢰⡀⠀⠀⠀⠀⠀⠀⠁
⢀⣿⡆⢀⡾⠀⠀⠀⠀⣾⠏⢿⣿⣿⣿⣯⣙⢷⡄⠀⠀⠀⠀⠀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣿⣻⢿⣷⣀⣷⣄⠀⠀⠀⠀⢸⠀
⢸⠃⠠⣼⠃⠀⠀⣠⣾⡟⠀⠈⢿⣿⡿⠿⣿⣿⡿⠿⠿⠿⠷⣄⠈⠿⠛⠻⠶⢶⣄⣀⣀⡠⠈⢛⡿⠃⠈⢿⣿⣿⡿⠀⠀⠀⠀⠀⡀
⠟⠀⠀⢻⣶⣶⣾⣿⡟⠁⠀⠀⢸⣿⢅⠀⠈⣿⡇⠀⠀⠀⠀⠀⣷⠂⠀⠀⠀⠀⠐⠋⠉⠉⠀⢸⠁⠀⠀⠀⢻⣿⠛⠀⠀⠀⠀⢀⠇
⠀⠀⠀⠀⠹⣿⣿⠋⠀⠀⠀⠀⢸⣧⠀⠰⡀⢸⣷⣤⣤⡄⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡆⠀⠀⠀⠀⡾⠀⠀⠀⠀⠀⠀⢼⡇
⠀⠀⠀⠀⠀⠙⢻⠄⠀⠀⠀⠀⣿⠉⠀⠀⠈⠓⢯⡉⠉⠉⢱⣶⠏⠙⠛⠚⠁⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⡇
⠀⠀⠀⠀⠀⠀⠻⠄⠀⠀⠀⢀⣿⠀⢠⡄⠀⠀⠀⣁⠁⡀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⢀⣐⡟⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⢠⡇
*/



//----------------------------------------------------------------------------------------------------------------------------------------
const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [userID, setUserID] = useState(null);
  const [machineID, setmachineID] = useState("");
  const [energyGoal, setEnergyGoal] = useState(null);
  const [newEnergyGoal, setNewEnergyGoal] = useState("");
  const [showEnergyGoalModal, setShowEnergyGoalModal] = useState(false);

  const [recommendations, setRecommendations] = useState([]); 
  const [showRecModal, setShowRecModal] = useState(false);

  const navigate = useNavigate();

  // State for role base ui
  const [loggedUsers, setLoggedUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [energyLogs, setEnergyLogs] = useState([]);
  const [devicesInMachine, setDevicesInMachine] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");


//----------------------------------------------------------------------------------------------------------------------------------------
// Auto load content
  // !!Extract email from JWT token when page is load
  useEffect(() => {
    const token = localStorage.getItem("token");


    // !!If it dont exist, means they exipired, then redirect them back to login, ask them to login again
    if (!token) {
      navigate("/"); 
      return;
    }
    try {
      // !!Decode the jwt token and store to the variable
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      setFirstName(decoded.firstName);
      setLastName(decoded.lastName);
      setUserType(decoded.userType);
      setUserID(decoded.userId);
      setmachineID(decoded.machineId);
    } catch (error) {
      console.error("Invalid token, logging out");
      localStorage.removeItem("token");
      // Redirect to login if token is invalid
      navigate("/");
    }
  }, [navigate]);


  // //Simulate weekly energy usage for the user every time they logged in
  useEffect(() => {
    const hasSimulated  = localStorage.getItem("hasSimulatedEnergy");
    if (userID && machineID && hasSimulated === "false") {
      simulateEnergyUsage();
    }
  }, [userID, machineID]); 

  // Simulate daily energy usage for the user every time they logged in and stay in the page for 5 minutes
  useEffect(() => {
    if (!userID || !machineID) return;

    const interval = setInterval(() => {
      simulateDailyUsage();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [userID, machineID]);

  useEffect(() => {
    if (userID) {
      fetchEnergyGoal();
    }
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    const interval = setInterval(() => {
      checkRecommendations(userID);
    }, 1 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval); 
  }, [userID]);
//----------------------------------------------------------------------------------------------------------------------------------------  

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/api/recommendation`, {
        userID,
        action: "fetch",
      });

      setRecommendations(response.data.recommendations);
      setShowRecModal(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };
  const checkRecommendations = async (userID) => {
    try {
      await axios.post(`${window.location.origin}/api/recommendation`, {
        userID,
        action: "check",
      });
    } catch (error) {
      console.error("Recommendation check failed:", error);
    }
  };

  const updateEnergyGoal = async () => {
    try {
      if (newEnergyGoal< 0){
        alert("Energy goal can not be negative number");
        setShowEnergyGoalModal(false);
        return;
      }

      if (newEnergyGoal > 1000){
        alert("Energy goal can not be larger than 1000");
        setShowEnergyGoalModal(false);
        return;
      }

      const response = await axios.post(`${window.location.origin}/api/user`, {
        action: "updateEnergyGoal",
        userID,
        newEnergyGoal: parseFloat(newEnergyGoal),
      });

      if (response.status === 200) {
        alert("Energy goal updated successfully");
        setEnergyGoal(newEnergyGoal); 
        setShowEnergyGoalModal(false);
        setNewEnergyGoal(""); 
      }
    } catch (error) {
      alert("Failed to update energy goal. Please try again.");
    }
  };

  const fetchEnergyGoal = async () => {
    try {
      const response = await axios.post(`${window.location.origin}/api/user`, {
        action: "getEnergyGoal",
        userID,
      });

      if (response.status === 200) {
        setEnergyGoal(response.data.energyGoal);
      }
    } catch (error) {
      console.error("Failed to fetch energy goal:", error);
    }
  };

  const simulateEnergyUsage = async () => {
    console.log("Simulating weekly energy usage for user:", userID, "machine:", machineID);
    localStorage.setItem("hasSimulatedEnergy", "true");

    try {
      const response = await axios.post(`${window.location.origin}/api/energy`, {
        action: "simulateWeeklyUsage",
        userID,
        machineID,
      });
      console.log("returned from response::: --->", response.data);
    } catch (error) {
      console.error("Failed to call energy api:", error);
    }
  };

  const simulateDailyUsage = async () => {
    try {
      await axios.post(`${window.location.origin}/api/energy`, {
        action: "simulateDailyUsage",
        userID,
        machineID,
      });
    } catch (error) {
      console.error("Failed to call energy api:", error);
    }
  };

  // Handle logout, by clear token and go back to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  // Handle email update, by redirect to verify page and further update-email page
  const handleUpdateEmail = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    // Test
    if (email.length > 100) {
      alert("Your email has length > 100, please enter again.");
      return;
    }
    navigate("/verify", { state: { email, redirectTo: "/updateEmail" } });
  };

  // Handle password, by redirect to password reset page
  const handleUpdatePassword = () => {
    navigate("/verify", { state: { email, redirectTo: "/passwordReset2" } });
  };

  // Fetch data for manager and admin, not for dweller
  const fetchData = async (action) => {
    try {
      const response = await axios.post(`${window.location.origin}/api/profile`, {
        action,
        userID,
        machineID
      });

      // Show all users logged in this system
      if (action === "getLoggedUsers") 
        setLoggedUsers(response.data.users);
      // Show all users activities in this system
      if (action === "getUserActivityLogs") 
        setActivityLogs(response.data.logs);
      // Show all users energy usage in this system
      if (action === "getEnergyUseLogs") 
        setEnergyLogs(response.data.logs);
      // Show all devices added in this system
      if (action === "getDevicesInMachine") 
        setDevicesInMachine(response.data.devices);
      if (action === "getSecurityLogs") 
        setSecurityLogs(response.data.logs);

      // Display modal
      setModalType(action);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
//----------------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="profile-container">

      <h1 style={{
        fontSize: 40,
        fontStyle: "italic",
        color: "#fca17d", /* Matches the card color */
        textAlign: "center",
        marginBottom: "2rem",
      }}>Profile</h1>

      {/* Profile Info */}
      <div className="profile-card"
      style = {{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <div className="profile-image">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style = {{
              width: 40,
              height: 40,
            }}
          >
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M6 20v-2a6 6 0 0112 0v2"></path>
          </svg>
        </div>



        <h2>{firstName} {lastName}</h2>
        <h3>{email}</h3>
        <h3>User Type: {userType}</h3>

        <div>
          <h3>Monthly Energy Saving Goal:</h3>
          <p>{energyGoal !== null ? `${energyGoal} kWh` : "Not set"}</p>
          <button onClick={() => setShowEnergyGoalModal(true)}>Change Energy Goal</button>
        </div>

        <div>
          <button onClick={fetchRecommendations}> View Recommendations</button>
        </div>

      </div>

      {/* 🔹 Recommendations Modal */}
      {showRecModal && (
        <div className="modal-overlay" onClick={() => setShowRecModal(false)}>
          <div className="modal-content">
            <h3>Device Recommendations</h3>
            <ul>
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <li key={rec.RecID}>{rec.SuggestedAction}</li>
                ))
              ) : (
                <p>No recommendations at this time.</p>
              )}
            </ul>
            <button onClick={() => setShowRecModal(false)}>Close</button>
          </div>
        </div>
      )}


      {showEnergyGoalModal && (
        <div className="modal-overlay" onClick={() => setShowEnergyGoalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Set New Energy Goal</h3>
            <input
              type="number"
              placeholder="Enter energy goal (kWh)"
              value={newEnergyGoal}
              onChange={(e) => setNewEnergyGoal(e.target.value)}
              required
            />
            <button onClick={updateEnergyGoal}>Save</button>
            <button onClick={() => setShowEnergyGoalModal(false)}>Cancel</button>
          </div>
        </div>
      )}

    {/* Manager Only Buttons */}
    {(userType === "Home_Manager" || userType === "Admin") && (
        <div className="profile-card" style={{ marginTop: "2rem" }}>
          <button onClick={() => fetchData("getLoggedUsers")}>View Logged-in Users</button>
          <button onClick={() => fetchData("getUserActivityLogs")}>View User Activity Logs</button>
          <button onClick={() => fetchData("getEnergyUseLogs")}>View Energy Logs</button>
          <button onClick={() => fetchData("getDevicesInMachine")}>View Devices</button>
        </div>
    )}

    {userType === "Admin" && (
      <div className="profile-card" style={{ marginTop: "2rem" }}>
        <button onClick={() => fetchData("getSecurityLogs")}>View Security Logs</button>
      </div>
    )}

    {/* Update Email & Password Buttons */}
    <div className="profile-card"
        style={{
          marginTop: "2rem",
    }}>
      <button onClick={handleUpdateEmail}>
        Update Email
      </button>

      <button onClick={handleUpdatePassword}>
        Update Password
      </button>
    </div>

   {/* Profile Info */}
    <div>
      <Link to="/">
            <button onClick={handleLogout}>
              Log Out
            </button>
      </Link>
    </div>

    {/* Modal for manager only contents */}
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content">

          <h3>
            {modalType === "getLoggedUsers" ? "Logged-in Users"
              : modalType === "getUserActivityLogs" ? "User Activity Logs"
              : "Energy Logs"}
          </h3>

          {/* Display logs */}
          <ul style={{ textAlign: "left", maxHeight: "400px", overflowY: "auto" }}>

            {(modalType === "getLoggedUsers" ? loggedUsers
              : modalType === "getUserActivityLogs" ? activityLogs
              : energyLogs).map((log, index) => (

                <li key={index} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #fca17d" }}>

                  <strong>{log.Timestamp ? new Date(log.Timestamp).toLocaleString() : "No Timestamp"}</strong>
                  <br />

                  {modalType === "getUserActivityLogs" ? (
                    <>
                      <strong>User ID:</strong> {log.UserID || "Unknown"}<br />
                      <strong>Device ID:</strong> {log.DeviceID || "Unknown"}<br />
                      <strong>Action:</strong> {log.Action || "N/A"}
                    </>
                    ) : modalType === "getLoggedUsers" ? (
                      <>
                        <strong>Name:</strong> {log.FirstName} {log.LastName} <br />
                        <strong>Email:</strong> {log.Email}
                      </>
                    ) : (
                      log.EventDescription || JSON.stringify(log, null, 2)
                  )}
                </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    )}

    {/* Modal for showing devices */}
    {showModal && modalType === "getDevicesInMachine" && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()} 
        >
          <h3>
            Devices in this Machine
          </h3>
          
          <ul style={{ textAlign: "left", maxHeight: "400px", overflowY: "auto"}}>

            {devicesInMachine.map((device, index) => (
              <li key={index} style={{ 
                marginBottom: "10px", 
                padding: "10px", 
                borderBottom: "1px solid #fca17d" }}
              >
                <strong>{device.DeviceName}</strong> - {device.DeviceType} ({device.Status})
              </li>
            ))}
          </ul>

          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    )}

    {/* Modal for showing security log */}
    {showModal && modalType === "getSecurityLogs" && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content">

          <h3>Security Logs</h3>
          <ul style={{ textAlign: "left", maxHeight: "400px", overflowY: "auto" }}>
            {securityLogs.length > 0 ? (
              securityLogs.map((log, index) => (
                <li key={index} style={{ 
                  marginBottom: "10px", 
                  padding: "10px", 
                  borderBottom: "1px solid #fca17d" }}
                >
                  <strong>Event:</strong> {log.EventDescription} <br />
                  <strong>Timestamp:</strong> {new Date(log.Timestamp).toLocaleString()}
                </li>
              ))
            ) : (
              <p>No security logs found.</p>
            )}
          </ul>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    )}

    </div>
  );
};

export default ProfilePage;