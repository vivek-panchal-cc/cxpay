import React from "react";

function AlreadyRegistered() {
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Already Registered</h3>
        </div>
        <div className="modal-body">
          <p>Your mobile Number is already registered with us as</p>
          <p className="user_name">USER NAME</p>
          <div className="popup-btn-wrap">
            <a className="btn btn-primary" href="/login">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlreadyRegistered;
