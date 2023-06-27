import React from "react";
import { Link } from "react-router-dom";

function AlreadyRegistered(props) {
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Already Registered</h3>
        </div>
        <div className="modal-body">
          <p style={{ "margin-bottom": "25px" }}>
            Mobile number is already registered
          </p>
          {/* <p className="user_name">{username}</p> */}
          <div className="popup-btn-wrap">
            <Link className="btn btn-primary" to="/login">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlreadyRegistered;
