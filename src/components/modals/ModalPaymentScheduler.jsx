import React, { useRef, useEffect } from "react";
import styles from "./modal.module.scss";
import ReactDatePicker from "react-datepicker";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { schedulePaymentSchema } from "schemas/sendPaymentSchema";
import TimePicker from "components/time-picker/TimePicker";
import { SCHEDULE_BUFFER } from "constants/all";

const ModalPaymentScheduler = (props) => {
  const { id, show, setShow, className, classNameChild, handleSubmit } = props;
  const modalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      time: "",
      // specification: "",
    },
    validationSchema: schedulePaymentSchema,
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      const { date, time, specification } = values;
      const dt = new Date(`${date.toDateString()} ${time}`);
      const dts = dt.toLocaleDateString("en-CA");
      const tms = dt.toLocaleTimeString(undefined, { hourCycle: "h24" });
      const params = {
        schedule_date: `${dts} ${tms}`,
        // overall_specification: specification,
      };
      handleSubmit && (await handleSubmit(params.schedule_date));
    },
  });

  const handleDateChange = async (date) => {
    await formik.setFieldValue("date", date);
  };

  const handleTimeChange = async (time) => {
    setTimeout(async () => {
      await formik.setFieldValue("time", time);
    }, 100);
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
                <div className="row">
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <TimePicker
                        classNameInput="w-full form-control"
                        minutesSelection="quater"
                        bufferTime={SCHEDULE_BUFFER}
                        selecteDate={formik.values.date}
                        selectedTime={""}
                        onChange={handleTimeChange}
                      />
                      {formik.touched.time && formik.errors.time && (
                        <p className="text-danger pb-0">{formik.errors.time}</p>
                      )}
                    </div>
                  </div>
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

export default ModalPaymentScheduler;
