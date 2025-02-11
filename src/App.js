import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/nav.js";

import Login from "./pages";
import Bedroom from "./pages/Bedroom.js";
import Kitchen from "./pages/Kitchen.js";
import LivingRoom from "./pages/LivingRoom.js";
import HomeScreen from "./pages/HomeScreen.js";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Bedroom />} />
        <Route path="/contact" element={<Kitchen />} />
        <Route path="/blogs" element={<LivingRoom />} />
        <Route path="/sign-up" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
