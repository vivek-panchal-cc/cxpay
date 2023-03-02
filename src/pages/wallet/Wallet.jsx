import React from "react";
import { Link } from "react-router-dom";

function Wallet() {
  return (
    <div className="p-4">
      <h1>Wallet</h1>
      <Link to="/wallet/add-card">Go to Add-Card</Link>
      <div>
        <Link to="/wallet/link-bank">Go to Add Bank</Link>
      </div>
      <div>
        <Link to="/wallet/bank-list">Bank List</Link>
      </div>
      <Link to="/wallet/view-card">Cards List</Link>
    </div>
  );
}

export default Wallet;
