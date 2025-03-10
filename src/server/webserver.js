// copy stuff from Dylan's server (TODO: remove this when done)
const express = require('express');         // Import express to create a server
const cors = require('cors');               // Import cors to allow requests

const app = express();                      // Create an express application
app.use(express.json());                    // Middleware to parse JSON bodies
app.use(cors());                            // Middleware to allow cross-origin requests


/* 
MASSIVE wall of javascript, needs to be pasted as it can't be imported. I love React :)
NOTE: This isn't particularly efficient. Too bad!

 /===============================\
/                                 \
|      BEHOLD: THE GREAT WALL     |
|          OF JAVASCRIPT          |
\                                 /
 \===============================/


Javascript that should be running on the NodeJS server.
Handles devices, data gathering, and data formatting


TODO: (if you know what you're doing)
---------------------
General Stuff:
    keywords table          - needed to standardise the words used for specific things. eg: "light" or "lightswitch"
                            - could be in code, or just a text doc we reference
                            - depends what we want to depend on

netDevice:
    update()                - requires networking. low priority. do when everything else works


networkDataInterface:
    full design             - requires a LOT of networking
    and implementation      - unknown how it should be structured
                            - do later

simulator: 
    typeMap                 - data generating functions. The hard bit
                            - only tackle if you know what you're doing
*/

class serverDeviceManager {
    constructor() {
        // time is in ms to be compatible with Date.now()
        // default value is 30 seconds
        this.updateInterval = 30000

        // empty devices object, will act as a sort of hashmap for devices
        // eg, devices["1234"] is device with id 1234
        this.devices = {}

        // sets the time when the object is initialised
        // Good for logging purposes, may be unneccessary
        this.initTime = Date.now()
    }

    // slighlty janky way of adding a device to the psuedo-hashmap
    // returns true and adds the device if it doesn't already exist
    // returns false otherwise 
    // STRONGLY COUPLES this class to the "device" class
    addDevice(device) {
        if (!this.devices[""+device.id]) {
            this.devices[""+device.id] = device
            return true
        }
        else {
            return false
        }
    }

    // removes a given device from the psuedo-hashmap
    // returns true and deletes the device if it existed, false otherwise
    removeDevice(device) {
        if (this.devices[""+device.id]) {
            delete this.devices[""+device.id]
            return true
        }
        else {
            return false
        }
    }

    // calls the "update" function for all entries in "devices"
    // STRONGLY COUPLES this class to the "device" class
    updateDevices() {
        for (i in this.devices) {
            this.devices[""+i].update()
        }
    }

    // simply sets the "updateInterval" value
    // technically unneccessary, but implemented due to possible complications later
    setUpdateInterval(n) {
        this.updateInterval = n
    }
}

/*

/------------------------------------\
|       ABSTRACT DEVICE CLASS:       |
|     DO NOT DIRECTLY INSTANTIATE    |
| USE simDevice OR netDevice INSTEAD |
|             THANK YOU              |
\------------------------------------/

// IMPORTANT!!! - if this is changed, the client-side class must be changed too!

*/
class device {
    constructor(ID, name, type, location) {
        // an empty object to be used as a psuedo-hashmap
        // all the data/information related to a device is to be stored using this
        // for example, on/off can be stored as data["power"] = "on"
        // a list of keywords to be used should be created
        this.data = {}

        // numerical ID that links with everything else (database, etc)
        // NEEDS to be unique
        // probably should be generated with the database somehow
        this.ID = ID

        // the name of the device
        // eg: "John's Bedroom Light"
        this.name = name

        // the type of device
        // eg: "light", "oven", etc
        // NOTE: used to determine what kind of simulated data should be generated
        this.deviceType = type

        // where the device is located in the house
        // will be used to determine where to display it in the front end
        // eg: "Living Room"
        this.location = location
    }

    // retrieve data from the object
    // returns value on success, null on failure
    // not strictly neccessary, but good practice and may be required later
    getData(key) {
        if (this.data[""+key] != undefined) {
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
        if (typeof(key) == String && value != undefined && value != null) {
            this.data[""+key] = value
            return true
        }
        else {
            return false
        }
    }

    // abstract method to be implemented in sublclasses
    // no way to do strict abstract methods in javascript, this is the best you can do
    // this version should never be called. ever. seriously
    update() {
        throw new Error("ATTEMPTED TO UPDATE RAW DEVICE, WITH ID: "+this.ID)
    }
}

// a simulated device
// going to be used exclusively until propper networking code is written
class simDevice extends device {
    
    constructor(ID, name, type, location, simulator) {
        // see "device" class decleration for comments
        this.ID = ID
        this.name = name
        this.deviceType = type
        this.location = location

        // the simulator object responsible for generating data for this device
        // simulator object must be delcared first
        this.simulator = simulator
    }

    /* These may be needed later
    getData() {}
    setData() {}
    */

    // interface with the simulater object to get fresh data
    // will update values in the "data" object
    update() {
        this.simulator.generateData(this)
    }
}

// a real device that must be networked with
// TODO: not currently implemented, needs high quality netcode
class netDevice extends device {
    update() {
        throw new Error("netDevice update() NOT IMPLEMENTED YET")
    }
}

// the object responsible for generating simulated data
// the big one
class simulator {
    constructor(timescale) {
        // timescale the simulator works on. A multiplier to real time
        // eg: 1 is realtime, 2 is double speed etc
        this.timescale = timescale

        // the timestamp of the simulator's instantisation. used in calculations
        this.initTime = Date.now()

        // a decimal representation of the time. used in calculations
        // may also be used as a timestamp of when a fake reading is "taken"
        // eg: 6:30 PM = 18.30
        this.timeInDay = 0.0

        // a completely random multiplier value to give more variance to generated data
        // only used in calculations
        // should range between 0.85 - 1.15
        this.dayMult = 1

        // an object linking types (deviceType) to a function that will generate a single data point
        this.typeMap = {}

        // typeMap functions
        // the big bit
        // every type of device should have an entry in here
        // 
        this.typeMap["example"] = function(device, sim) {
            return 1
        }
    }

    // self explanitory, used for formality reasons
    // may also be required later
    setTimescale(n) {
        this.timescale = n
    }

    // uses the correct typeMap entry to generate and return a data point
    // returns null on failure
    generateData(device) {
        if (typeMap[""+device.deviceType] != undefined) {
            return this.typeMap[""+device.deviceType](device, this)
        }
    }
}

// TODO: not being implemented for now, needs netcode
class networkDataInterface {
    constructor() {throw new Error("networkDataInterface NOT IMPLEMENTED")}
}


/*
 /===============================\
/                                 \
|     THIS WAS: THE GREAT WALL    |
|          OF JAVASCRIPT          |
\                                 /
 \===============================/

*/

/*
API ROUTES
----------
A route will be needed for:

- getting all devices

- getting new devices (could reuse the above, depends on implementation - security concearns)

- updating one device's data

- updating ALL device's data (could reuse the above, depends on implementation - security concearns)

*/


// Testing route
app.post('/api/deviceReq', (req, res) => {
    // just make sure it works
    console.log("deviceReq recieved");

    // create a sample device for testing purposes
    var sampleDevice = new simDevice(123,"sample device","lightswitch","living room",null);
    sampleDevice.data["on/off"] = "on";
    sampleDevice.data["colour"] = "red;"

    res.json(JSON.stringify(sampleDevice))
    return res.status(200);
});


// NOTE: this is the same port as the other server file
// Start the server on port 5000 to listen for requests from react front-end
app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});