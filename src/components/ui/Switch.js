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
      className={`w-10 h-5 flex items-center rounded-full p-1 ${
        isOn ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
          isOn ? "translate-x-5" : ""
        }`}
      ></div>
    </button>
  );
};

export default Switch;
