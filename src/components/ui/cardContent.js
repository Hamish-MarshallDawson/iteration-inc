import React from "react";

const cardContent = ({ children, className }) => {
  return <div className={`cardContentUI ${className}`}>{children}</div>;
};

export default cardContent;
