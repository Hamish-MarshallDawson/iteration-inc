import SmartDeviceGrid from "../components/SmartDeviceGrid";
import ServerDeviceGrid from "../components/ServerDeviceGrid";

// web server connection stuff
import axios from "axios";


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




// setup function. we need a deviceManager
// need to integrate this into sessionstorage eventually, that can wait
function clientSetup() {
  console.log("TEST - PAGE LOADED")

}

// send an empty request, testing
async function sendReq() {
  console.log("REQUEST SENT: sendReq")
  var response = await axios.post("http://localhost:5000/api/deviceReq")
  if (response.status === 200) {
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
  if (response.status === 200) {
    console.log("REQUEST: getAllDevices SUCCESS");
    console.log("Response: "+JSON.stringify(response))
    console.log("Parsing JSON: "+response.data)
    console.log("parsed data: ")
    console.log(JSON.parse(response.data))// needs to be on a new line to format correctly
    // actual code
    // turn response into actual devices again
    for (let device in JSON.parse(response.data)) {
        // needs device and dom
        // for now just log them
        console.log("RECIEVED DEVICE:")
        console.log(new clientDevice( (JSON.parse(response.data))[""+device],null))

    }

}
else {console.log("Request Fail")}
}

function DeviceTest() {
  return (
    <div onLoad = {clientSetup()}>
        <ServerDeviceGrid />
        <p onClick={sendReq} > test: sendReq</p>
        <p onClick={getAllDevices} > test: getAllDevices</p>
    </div>
    )
}

export default DeviceTest;
