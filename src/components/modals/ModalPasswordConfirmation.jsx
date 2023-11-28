import Input from "components/ui/Input";
import React, { useEffect, useRef, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { useFormik } from "formik";
import styles from "./modal.module.scss";
import { deleteAccountPassword } from "schemas/validationSchema";

function ModalPasswordConfirmation(props) {
  const {
    children,
    className,
    classNameChild,
    id,
    show,
    setShow,
    handleCallback,
    heading = "Confirm",
    subHeading = "",
    error = "",
  } = props;
  const modalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: deleteAccountPassword,
    onSubmit: (values) => {
      handleCallback(values.password);
    },
  });

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        if (setShow) setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  if (!show) return null;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className} del-modal-main`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header flex-column">
              <h3 className="text-center">{heading}</h3>
              <p>{subHeading}</p>
              {error ? (
                <p className="text-danger text-center">{error}</p>
              ) : null}
            </div>
            <div className="modal-body">
              <div>{children}</div>
              <form onSubmit={formik.handleSubmit}>
                <div className="form-field">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.touched.password && formik.errors.password}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  <span className="eye-icon" style={{ top: "24px" }}>
                    {showPassword ? (
                      <IconEyeOpen onClick={() => setShowPassword(false)} />
                    ) : (
                      <IconEyeClose onClick={() => setShowPassword(true)} />
                    )}
                  </span>
                </div>

                <div className="popup-btn-wrap d-flex align-items-center justify-content-center gap-4">
                  <button
                    type="button"
                    className="outline-btn px-4"
                    style={{ minWidth: "initial" }}
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
                  {/* {!error ? ( */}
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-3"
                    style={{ minWidth: "initial" }}
                    // onClick={handleCallback}
                    disabled={formik.values.password?.length === 0}
                    autoFocus={true}
                  >
                    confirm
                  </button>
                  {/* ) : null} */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPasswordConfirmation;
