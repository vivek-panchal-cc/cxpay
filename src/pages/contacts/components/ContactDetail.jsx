import Modal from "components/modals/Modal";
import React from "react";
// import { IconRequest, IconSend } from "styles/svgs";

function ContactDetail(props) {
  const { id, show, setShow, data, handleClose } = props;
  // if (!show) return;
  return (
    <Modal id={id} show={show} setShow={setShow}>
      <div className="con-details-modal" id="con-details-popup" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="con-user-profile-wrap">
                <img
                  src={
                    data.profile_image
                      ? data.profile_image
                      : "assets/images/user-avatar.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="modal-body">
              <h3>
                {data.user_type === "business"
                  ? data.company_name
                  : data.first_name + " " + data.last_name}
              </h3>
              <div className="cu-details-wrap">
                <div>
                  <p className="sub-head">Email</p>
                  <p>{data.email ? data.email : "-"}</p>
                </div>
                <div>
                  <p className="sub-head">Phone</p>
                  <p>{data?.mobile_number}</p>
                </div>
                <div className="cm-sucess-msg">Contact Added Successfully</div>
              </div>
              {/* <div className="con-modal-btn-wrap">
                <a href="/" className="btn btn-primary">
                  <IconSend style={{ stroke: "#F3F3F3" }} />
                  <span>Send</span>
                </a>
                <a href="/" className="btn btn-primary">
                  <IconRequest />
                  <span>Request</span>
                </a>
              </div> */}
              <div className="con-modal-btn-wrap">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ContactDetail;
