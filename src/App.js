import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/nav.js";

import Login from "./pages/Login.js";
import Bedroom from "./pages/Bedroom.js";
import Kitchen from "./pages/Kitchen.js";
import LivingRoom from "./pages/LivingRoom.js";
import EnergyReport from "./pages/EnergyReport.js";
import Awards from "./pages/Awards.js";
import ProfilePage from "./pages/ProfilePage.js";

import PasswordReset from "./pages/PasswordReset.js";
import PasswordReset2 from "./pages/PasswordReset2.js";
import SignUp from "./pages/SignUp.js";
import Verify from "./components/Verify"; 
import SignUp2 from "./pages/SignUp2.js";



import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <MainContent />{" "}
        {/* Move everything inside a separate component that has access to useLocation */}
      </div>
    </Router>
  );
}

// Separate component for conditional rendering
function MainContent() {
  const location = useLocation(); // Get current route

  return (
    <>
      {/* Render Navbar only if NOT on login page */}
      {location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/login" element={<Login />} />{" "} */}
        {/* This is the route to the Login page in directory ./pages/Login.js, imported in the header */}
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
      </Routes>
    </>
  );
}

export default App;
