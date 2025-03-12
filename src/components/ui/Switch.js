import React, { useEffect,useState } from "react";

const Switch = ({ isOn, onToggle  }) => {
  const [state, setState] = useState(isOn);

  useEffect(() => {
    setState(isOn); 
  }, [isOn]);

  const toggle = () => {
    const newState = !state;
    setState(newState);
    if (onToggle) onToggle(newState); 
  };

  return (
    <button
      onClick={toggle}
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
