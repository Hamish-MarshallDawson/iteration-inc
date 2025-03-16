// Filename - pages/about.js

import React from "react";
import SmartDeviceGrid from "../components/SmartDeviceGrid";
import "../App.css";

const Bedroom = () => {
  return <SmartDeviceGrid roomId={3} allowedDeviceTypes={["lightbulb", "speaker", "other"]}/>;
};

export default Bedroom;

