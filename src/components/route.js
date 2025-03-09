import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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
import SignUp2 from "../pages/SignUp2.js";
import TestDB  from "../pages/Testdb.js";

import Navbar from "./nav.js"; // Ensure correct import

function MainContent() {
  const location = useLocation(); // Get current route

  // Define routes where the Navbar should be hidden
  const hideNavbarRoutes = [
    "/",
    "/sign-up",
    "/passwordReset",
    "/passwordReset2",
  ];
// routes were refactored to this file for conviences
  return (
    <>
      <div className="structure">
        {/* Render Navbar only if NOT in the hideNavbarRoutes list */}
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <div className="MainContent">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Bedroom" element={<Bedroom />} />
            <Route path="/Kitchen" element={<Kitchen />} />
            <Route path="/Livingroom" element={<LivingRoom />} />
            <Route path="/Energyreport" element={<EnergyReport />} />
            <Route path="/Awards" element={<Awards />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/passwordReset" element={<PasswordReset />} />
            <Route path="/passwordReset2" element={<PasswordReset2 />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/sign-up-2" element={<SignUp2 />} />
            <Route path="/testdb" element={<TestDB />} />
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
