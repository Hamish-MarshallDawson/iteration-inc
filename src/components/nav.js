import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect"; // Detect mobile device
import { Link } from "react-router-dom";
import profileIcon from "./profileIcon.svg"; // Profile icon

function Navbar() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Toggle dropdown visibility on mobile
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    // Function to toggle the navbar visibility
    function toggleNavbar() {
      const navbar = document.querySelector(".navbar");
      navbar.classList.toggle("mobile-visible");
    }

    // Add event listener to hamburger menu for mobile view
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener("click", toggleNavbar);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (hamburgerMenu) {
        hamburgerMenu.removeEventListener("click", toggleNavbar);
      }
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <img src="/images/iterationincv3.png" alt="Logo" className="snake" />

        {/* Only show dropdown on mobile devices */}
        {isMobile && (
          <button
            className="hamburger-menu"
            onClick={toggleDropdown}
            aria-label="Toggle Navigation"
          >
            &#9776; {/* Hamburger Icon */}
          </button>
        )}

        {/* Mobile and Desktop Navigation Links */}
        <ul
          className={`nav-links ${isMobile && isDropdownVisible ? "show" : ""}`}
        >
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
            <Link to="/Energyreport">Energy Report</Link>
          </li>
          <li>
            <Link to="/Awards">Awards</Link>
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
}

export default Navbar;
