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
      className={`toggleBtnUI ${isOn ? "on" : "off"}`}
    >
      <div className="toggleCircleUI"></div>
    </button>
  );
};

export default Switch;
