import React, { useRef, useEffect } from "react";
import styles from "./modal.module.scss";
import ReactDatePicker from "react-datepicker";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { schedulePaymentSchemaRecurring } from "schemas/sendPaymentSchema";

const ModalPaymentSchedulerRecurring = (props) => {
  const { id, show, setShow, className, classNameChild, handleSubmit } = props;
  const modalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      date: new Date(),      
      // specification: "",
    },
    validationSchema: schedulePaymentSchemaRecurring,
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      const { date, specification } = values;
      const dt = new Date(`${date.toDateString()}`);
      const dts = dt.toLocaleDateString("en-CA");      
      const params = {
        schedule_date: `${dts}`,
        // overall_specification: specification,
      };
      handleSubmit && (await handleSubmit(params));
    },
  });

  const handleDateChange = async (date) => {
    await formik.setFieldValue("date", date);
  };

  // For closing the modal on click of outside the modal area
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

  useEffect(() => {
    if (!show) return;
    formik?.resetForm();
  }, [show]);

  if (!show) return null;
  return (
    <div
      className={`test modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">Schedule Your Payment</h3>
            </div>
            <div className="modal-body d-flex justify-content-center pb-5">
              <form onSubmit={formik.handleSubmit}>
                <div className="common-dr-picker">
                  <ReactDatePicker
                    className=""
                    selected={formik.values.date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    inline
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <p className="text-danger pb-0">{formik.errors.date}</p>
                  ) : null}
                </div>               
                {/* <div className="row">
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Specification"
                        name="specification"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.specification}
                        error={
                          formik.touched.specification &&
                          formik.errors.specification
                        }
                      />
                    </div>
                  </div>
                </div> */}
                <div className="popup-btn-wrap d-flex align-items-center justify-content-between gap-4">
                  <button
                    type="button"
                    className="outline-btn px-4"
                    style={{ minWidth: "initial" }}
                    onClick={() => setShow(false)}
                  >
                    Cancel
                  </button>
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    value="Schedule"
                    disabled={formik.isSubmitting}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaymentSchedulerRecurring;
