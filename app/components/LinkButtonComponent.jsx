import React from "react";

function LinkButtonComponent({ amount, onClick }) {
  return (
    <div>
      <button onClick={onClick}>Set Base Price and Purchase Plan</button>
    </div>
  );
}

export default LinkButtonComponent;
