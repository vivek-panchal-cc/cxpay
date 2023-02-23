import Modal from "components/modals/Modal";
import React from "react";

function InvitationSent(props) {
  const { id, show, setShow, handleClose } = props;
  // if (!show) return;
  return (
    <Modal id={id} show={show} setShow={setShow}>
      <div
        class="invite-sent-modal contact-pg-popup"
        id="invite-sent-popup"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center">
              <img
                src="assets/images/invite-sent.svg"
                alt=""
                class="invite-sent-logo"
              />
              <h3>Invitation Sent</h3>
              <div class="invite-send-btn">
                <button
                  onClick={() => handleClose(false)}
                  class="btn btn-primary"
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
