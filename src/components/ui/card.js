import React from "react";

const card = ({ children, className }) => {
  return <div className={`cardUI ${className}`}>{children}</div>;
};

export default card;
