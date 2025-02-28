import React from "react";

const cardContent = ({ children, className }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};

export default cardContent;
