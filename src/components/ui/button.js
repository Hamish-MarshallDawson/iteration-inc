import React from "react";

const button = ({ children, onClick, className }) => {
  return (
    <button className={`buttonUI ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default button;
