import React, { useState } from "react";
import { useFormik } from "formik";
import { inviteContactSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import Input from "components/ui/Input";
import InvitationSent from "./InvitationSent";
import { toast } from "react-toastify";

function InviteContact(props) {
  const { invitetitle } = props;
  const { setShow, getConatcts, page, search } = props;
  const [showInvitationSentPopup, setInvitationSentPopup] = useState(false);
  const [isShowContactPopup, setIsShowContactPopup] = useState(true);

  const formik = useFormik({
    initialValues: {
      mobile: "",
      email: "",
    },
    validationSchema: inviteContactSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.addContact(values);
        if (!data.success) throw data.message;
        if (data.data.alreadyInvited === false) {
          setIsShowContactPopup(false);
          getConatcts(page, search);
          if (invitetitle === "Add Contact") {
            toast.success("Contact details added successfully");
            setInvitationSentPopup(false);
            setShow(false);
          } else {
            return setInvitationSentPopup(true);
          }
        } else {
          setStatus(data.message);
        }
      } catch (error) {
        resetForm();
        setStatus(error);
      }
    },
  });

  return (
    <>
      {/* <Modal
        id="invitation_sent"
        show={showInvitationSentPopup}
        setShow={setShow}
      > */}
      <InvitationSent
        id="invitation_sent"
        show={showInvitationSentPopup}
        setShow={setInvitationSentPopup}
        handleClose={setShow}
      />
      {/* </Modal> */}

      <div
        className="invite-contact-modal contact-pg-popup"
        style={{ visibility: isShowContactPopup ? "visible" : "hidden" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src="assets/images/invite-con-img.svg"
                alt=""
                className="invite-logo"
              />
              <h3>{invitetitle}</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Mobile Number"
                        name="mobile"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                        error={formik.touched.mobile && formik.errors.mobile}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        error={formik.touched.email && formik.errors.email}
                        autoComplete={"new-email"}
                      />
                    </div>
                  </div>
                </div>
                <div className="popup-btn-wrap">
                  {formik.status && (
                    <p className="text-danger">{formik.status}</p>
                  )}
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value={invitetitle === "Add Contact" ? "Add" : "Invite"}
                    data-bs-dismiss="modal"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InviteContact;
