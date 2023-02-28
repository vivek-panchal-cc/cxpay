import React from "react";

function AlreadyRegistered(props) {
  // const { username } = props;
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Already Registered</h3>
        </div>
        <div className="modal-body">
          <p style={{ "margin-bottom": "25px" }}>
            Your account is already registered with us as
          </p>
          {/* <p className="user_name">{username}</p> */}
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
