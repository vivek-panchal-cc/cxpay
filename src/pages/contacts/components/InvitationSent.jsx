import Modal from "components/modals/Modal";
import React from "react";

function InvitationSent(props) {
  const { id, show, setShow, handleClose } = props;

  return (
    <Modal id={id} show={show} setShow={setShow}>
      <div
        className="invite-sent-modal contact-pg-popup"
        id="invite-sent-popup"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src="/assets/images/invite-sent.svg"
                alt=""
                className="invite-sent-logo"
              />
              <h3>Invitation Sent</h3>
              <div className="invite-send-btn">
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

export default InvitationSent;
