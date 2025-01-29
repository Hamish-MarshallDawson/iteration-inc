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
            <a href="/Rooms">Rooms</a>
          </li>
          <li>
            <a href="/Energy Report">Energy Report</a>
          </li>
          <li>
            <a href="/Awards">Awards</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
