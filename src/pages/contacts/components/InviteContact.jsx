import React, { useState } from "react";
import { useFormik } from "formik";
import { inviteContactSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import Input from "components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function InviteContact(props) {
  const {
    invitetitle,
    contactData,
    setConatctData,
    setInvitationSentPopup,
    setConatctDetailPopup,
    setShow,
    getConatcts,
    getInvitedConatcts,
    page,
    search,
    isInvitedFlag = false,
  } = props;
  const [isShowContactPopup, setIsShowContactPopup] = useState(true);
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile);
  const { country_code } = profile || {};

  const formik = useFormik({
    initialValues: {
      mobile: "",
      email: "",
      mobile_code: country_code,
    },
    validationSchema: inviteContactSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      console.log("GEEE###");
      try {
        const { data } = await apiRequest.addContact(values);
        if (!data.success) throw data.message;
        if (
          data.data.alreadyAdded === false ||
          data.data.alreadyInvited === false
        ) {
          setIsShowContactPopup(false);
          //getConatcts(page, search);
          if (data.data.contactDetails) {
            setConatctData(data.data.contactDetails);
            setConatctDetailPopup(true);
            setShow(false);
            if (isInvitedFlag) {
              navigate("/contacts");
            } else {
              getConatcts(1, "");
            }
          } else {
            setConatctData("");
            setInvitationSentPopup(true);
            setShow(false);
            //getInvitedConatcts(1,'')
            if (isInvitedFlag) {
              getInvitedConatcts(1, "");
            } else {
              navigate("/contacts/invited");
            }
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
      {/* <InvitationSent
        id="invitation_sent"
        show={showInvitationSentPopup}
        setShow={setInvitationSentPopup}
        handleClose={setShow}
      />
      <ContactDetail
        id="contact_detail"
        data={contactAddedData}
        show={showConatctDetailPopup}
        setShow={setConatctDetailPopup}
        handleClose={setShow}
      /> */}

      <div
        className="invite-contact-modal contact-pg-popup"
        style={{ visibility: isShowContactPopup ? "visible" : "hidden" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img
                src={`${
                  isInvitedFlag
                    ? "../assets/images/invite-con-img.svg"
                    : "assets/images/invite-con-img.svg"
                }`}
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
                <div className="pop-cancel-btn text-center">
                  <button
                    data-bs-dismiss="modal"
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
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
