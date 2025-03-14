import SmartDeviceGrid from "../components/SmartDeviceGrid";

// web server connection stuff
import axios from "axios";

// setup function. we need a deviceManager
function clientSetup() {
  console.log("TEST - PAGE LOADED")
}

// send an empty request, testing
async function sendReq() {
  console.log("REQUEST SENT: sendReq")
  var response = await axios.post("http://localhost:5000/api/deviceReq")
  if (response.status == 200) {
      console.log("REQUEST: sendReq SUCCESS");
      console.log("Response: "+JSON.stringify(response))
      console.log("Parsing JSON: "+response.data)
      console.log("parsed data: ")
      console.log(JSON.parse(response.data))// needs to be on a new line to format correctly
  }
  else {console.log("Request Fail")}
}

// send a request to get all the devices
async function getAllDevices() {
  console.log("REQUEST SEND: getAllDevices")
  var response = await axios.post("http://localhost:5000/api/allDevices")
  if (response.status == 200) {
    console.log("REQUEST: getAllDevices SUCCESS");
    console.log("Response: "+JSON.stringify(response))
    console.log("Parsing JSON: "+response.data)
    console.log("parsed data: ")
    console.log(JSON.parse(response.data))// needs to be on a new line to format correctly
    // actual code

}
else {console.log("Request Fail")}
}

function DeviceTest() {
  return (
    <div onLoad = {clientSetup()}>
        <SmartDeviceGrid />
        <p onClick={sendReq} > test: sendReq</p>
        <p onClick={getAllDevices} > test: getAllDevices</p>
    </div>
    )
}

export default DeviceTest;
