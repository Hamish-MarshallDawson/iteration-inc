import SmartDeviceGrid from "../components/SmartDeviceGrid";


function Kitchen() {
  return <SmartDeviceGrid roomId={2} allowedDeviceTypes={["lightbulb", "coffee", "speaker", "robot", "other"]}/> ; 
  }

export default Kitchen;

