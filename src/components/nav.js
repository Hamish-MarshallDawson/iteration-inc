import { Link } from "react-router-dom";
import profileIcon from "./profileIcon.svg"; // Import the SVG correctly

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-center">
        <img
          src="/images/iterationincv3.png"
          alt="Snake logo"
          className="snake"
        />
        <ul className="nav-links">
          <li>
            <Link to="/Livingroom">Living Room</Link>
          </li>
          <li>
            <Link to="/Kitchen">Kitchen</Link>
          </li>
          <li>
            <Link to="/Bedroom">Bedroom</Link>
          </li>
          <li>
            <Link to="/energy-report">Energy Report</Link>
          </li>
          <li>
            <Link to="/awards">Awards</Link>
          </li>
          <li className="profile-item">
            <Link className="ProfileLink" to="/profile">
              Profile
              <img src={profileIcon} alt="Profile" className="profileIcon" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
