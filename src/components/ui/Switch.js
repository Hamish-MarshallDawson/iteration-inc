import React, { useEffect } from "react";

const Switch = ({ isOn, onToggle }) => {
  useEffect(() => {
    // If needed, handle any side effects when the isOn prop changes.
  }, [isOn]);

  const toggle = () => {
    if (onToggle) onToggle(!isOn); // Toggle the state and notify parent.
  };

  return (
    <button onClick={toggle} className={`toggleBtnUI ${isOn ? "on" : "off"}`}>
      <div className="toggleCircleUI"></div>
    </button>
  );
};

export default Switch;
