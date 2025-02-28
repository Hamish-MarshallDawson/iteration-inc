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

import Authentication from "./pages/Authentication.js";
import PasswordReset from "./pages/PasswordReset.js";
import SignUp from "./pages/SignUp.js";

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
        <Route path="/authentication" element={<Authentication />} />{" "}
        {/* This is the route to the 2-factor authentication page in directory ./pages/Authentication.js, imported in the header */}
        <Route path="/passwordReset" element={<PasswordReset />} />{" "}
        {/* This is the route to the sign up page in directory ./pages/SignUp.js, imported in the header */}
      </Routes>
    </>
  );
}

export default App;
