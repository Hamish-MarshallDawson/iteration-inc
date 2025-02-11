// Filename - pages/index.js

import React from "react";

import logo from "../logo.svg";

import Navbar from "../components/nav";

const HomeScreen = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hi guys Hamish wrote this line here look how cool this is Edit</p>
        <p>This line can be edited in app.js!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default HomeScreen;
