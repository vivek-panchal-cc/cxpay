import React, { useRef, useEffect } from "react";
import styles from "./modal.module.scss";
import ReactDatePicker from "react-datepicker";
// import TimePicker from "react-time-picker";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { schedulePaymentSchema } from "schemas/sendPaymentSchema";
import TimePicker from "components/time-picker/TimePicker";

const ModalPaymentScheduler = (props) => {
  const { id, show, setShow, className, classNameChild, handleSubmit } = props;
  const modalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      time: "",
      specification: "",
    },
    validationSchema: schedulePaymentSchema,
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      const { date, time, specification } = values;
      const dt = new Date(`${date.toDateString()} ${time}`);
      const dts = dt.toLocaleDateString("en-CA");
      const tms = dt.toLocaleTimeString(undefined, { hourCycle: "h24" });
      const params = {
        schedule_date: `${dts} ${tms}`,
        overall_specification: specification,
      };
      handleSubmit && (await handleSubmit(params));
    },
  });

  const handleDateChange = (date) => {
    formik.setFieldValue("date", date);
  };

  const handleTimeChange = (time) => {
    formik.setFieldValue("time", time);
  };

  // For closing the modal on click of outside the modal area
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

  useEffect(() => {
    if (!show) return;
    formik.resetForm();
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
            <div className="modal-body d-flex justify-content-center">
              <form onSubmit={formik.handleSubmit}>
                <div className="">
                  <ReactDatePicker
                    className=""
                    selected={formik.values.date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    inline
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="text-danger pb-0">{formik.errors.date}</p>
                  )}
                </div>
                <div className="row">
                  <div className="col-12 col p-0">
                    <div className="form-field">
                      <TimePicker
                        value={formik.values.time}
                        onChange={handleTimeChange}
                        classNameInput="w-full form-control"
                      />
                      {/* <TimePicker
                        className="w-full form-control"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        clearIcon={null}
                        format="hh:mm:ss a"
                        maxDetail="second"
                        disableClock
                      /> */}
                      {formik.touched.time && formik.errors.time && (
                        <p className="text-danger pb-0">{formik.errors.time}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
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
                </div>
                <div className="popup-btn-wrap">
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
