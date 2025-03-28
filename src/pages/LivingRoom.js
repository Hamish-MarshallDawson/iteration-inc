// Filename - pages/about.js

import React from "react";
import SmartDeviceGrid from "../components/SmartDeviceGrid";
import "../App.css";

const LivingRoom = () => {
  return <SmartDeviceGrid roomId={1} allowedDeviceTypes={["lightbulb", "speaker", "thermostat", "other"]}/>;
};

export default LivingRoom;

