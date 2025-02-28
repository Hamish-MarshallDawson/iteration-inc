import React from "react";

const card = ({ children, className }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md bg-orange-300 ${className}`}>
      {children}
    </div>
  );
};

export default card;
