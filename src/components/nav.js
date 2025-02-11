import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left"></div>
      <div className="navbar-center">
        <img
          src="/images/iterationincv3.png"
          alt="Snake logo"
          className="snake"
        />
        <ul className="nav-links">
          <li>
            <Link to="/rooms">Rooms</Link>
          </li>
          <li>
            <Link to="/energy-report">Energy Report</Link>
          </li>
          <li>
            <Link to="/awards">Awards</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
