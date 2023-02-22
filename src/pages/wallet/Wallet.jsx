import React from "react";
import { Link } from "react-router-dom";

function Wallet() {
  return (
    <div className="p-4">
      <h1>Wallet</h1>
      <Link to="/wallet/add-card">Go to Add-Card</Link>
    </div>
  );
}

export default Wallet;
