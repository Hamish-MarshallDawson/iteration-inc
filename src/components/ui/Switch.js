import React, { useState } from "react";

const Switch = ({ onChange }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onChange) onChange(!isOn);
  };

  return (
    <button
      onClick={toggleSwitch}
      className={`toggleBtnUI ${isOn ? "on" : "off"}`}
    >
      <div className="toggleCircleUI"></div>
    </button>
  );
};

export default Switch;
