import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { inviteContactSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import Input from "components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import stylescss from "./modal.module.scss";
import { toast } from "react-toastify";

function ModalAddContact(props) {
  const {
    id,
    show,
    setShow,
    invitetitle,
    setConatctData,
    setInvitationSentPopup,
    setConatctDetailPopup,
    getConatcts,
    getInvitedConatcts,
    isInvitedFlag = false,
    isNavigate = true,
  } = props;
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile);
  const [countryList] = useCountriesCities();
  const { country_code } = profile || {};
  const modalRef = useRef(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mobile: "",
      email: "",
      country_code: country_code,
    },
    validationSchema: inviteContactSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.addContact(values);
        if (!data.success) throw data.message;
        if (
          data.data.alreadyAdded === false ||
          data.data.alreadyInvited === false
        ) {
          if (data.data.contactDetails) {
            toast.success(data.message);
            setConatctData(data.data.contactDetails);
            setConatctDetailPopup(true);
            setShow(false);
            if (isInvitedFlag) {
              isNavigate && navigate("/contacts");
            } else {
              getConatcts();
            }
          } else {
            toast.success(data.message);
            setConatctData("");
            setInvitationSentPopup(true);
            setShow(false);
            if (isInvitedFlag) {
              getInvitedConatcts();
            } else {
              isNavigate && navigate("/contacts-invited");
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

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  if (!show) return null;

  return (
    <div
      className={`modal fade show ${stylescss.modal} del-modal-main`}
      id={id}
    >
      <div ref={modalRef}>
        <div className="invite-contact-modal contact-pg-popup">
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
                  <div className="row form-field">
                    <div className="col-4 ps-0">
                      <InputSelect
                        className="form-select form-control"
                        name="country_code"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.country_code}
                        error={
                          formik.touched.country_code &&
                          formik.errors.country_code
                        }
                        disabled={true}
                      >
                        <option value={""}>Country</option>
                        {countryList?.map((country) => (
                          <option
                            value={country.phonecode}
                            key={country.phonecode}
                          >
                            {country.phonecode} &nbsp; {country.country_name}
                          </option>
                        ))}
                      </InputSelect>
                    </div>
                    <div className="col-8 px-0">
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
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      }`}
                      value={invitetitle === "Add Contact" ? "Add" : "Invite"}
                      disabled={formik.isSubmitting}
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
      </div>
    </div>
  );
}

export default ModalAddContact;
