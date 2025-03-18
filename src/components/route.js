import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import Login from "../pages/Login.js";
import Bedroom from "../pages/Bedroom.js";
import Kitchen from "../pages/Kitchen.js";
import LivingRoom from "../pages/LivingRoom.js";
import EnergyReport from "../pages/EnergyReport.js";
import Awards from "../pages/Awards.js";
import ProfilePage from "../pages/ProfilePage.js";

import PasswordReset from "../pages/PasswordReset.js";
import PasswordReset2 from "../pages/PasswordReset2.js";
import SignUp from "../pages/SignUp.js";
import Verify from "./Verify.js";
import FillInfo from "../pages/SignUpFillingInfo.js";
import UpdateEmail from "../pages/UpdateEmail.js";
import ConfirmUpdateEmail from "../pages/ConfirmUpdateEmail.js";

import Navbar from "./nav.js"; // Ensure correct import

// TESTING, remove later
// also remove the associated route
import DeviceTest from "../pages/DeviceTest.js";

function MainContent() {
  const location = useLocation(); // Get current route

  // Define routes where the Navbar should be hidden
  const hideNavbarRoutes = [
    "/",
    "/sign-up",
    "/passwordReset",
    "/passwordReset2",
    "/verify",
    "/filling-information",
  ];

  // Automatically replace the URL if navigating to the hidden route
  // Hide every route in the address bar so we are sneaky
  useEffect(() => {
    window.history.replaceState({}, "", "/");
  }, [location.pathname]);

  return (
    <>
      <div className="structure">
        {/* Render Navbar only if NOT in the hideNavbarRoutes list */}
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <div className="MainContent">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/bedroom" element={<Bedroom />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/livingroom" element={<LivingRoom />} />
            <Route path="/energyreport" element={<EnergyReport />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/passwordReset" element={<PasswordReset />} />
            <Route path="/passwordReset2" element={<PasswordReset2 />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/filling-information" element={<FillInfo />} />
            <Route path="/updateEmail" element={<UpdateEmail />} />
            <Route
              path="/confirmUpdateEmail"
              element={<ConfirmUpdateEmail />}
            />
            <Route path="/deviceTest" element={<DeviceTest />} />
            {/* Hidden route that automatically disappears from the URL */}
            <Route path="/hidden" element={<h1>Hidden Route</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

function RouteComponent() {
  return (
    <Router>
      <div className="App">
        <MainContent />
      </div>
    </Router>
  );
}

export default RouteComponent;
