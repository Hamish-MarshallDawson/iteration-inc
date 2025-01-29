import logo from "./logo.svg";
import "./App.css";
import Navbar from "./nav.js";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hi guys Hamish wrote this line here look how cool this is Edit</p>
        <p>This line can be edited in app.js!</p>
        <Navbar></Navbar>
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
}

export default App;
