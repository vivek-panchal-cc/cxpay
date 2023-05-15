import React, { useContext, useMemo, useState } from "react";
import PaymentUserItem from "./components/PaymentUserItem";
import { ScheduledPaymentContext } from "context/scheduledPaymentContext";
import { useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL } from "constants/all";
import { useFormik } from "formik";
import ReactDatePicker from "react-datepicker";
import { schedulePaymentSchema } from "schemas/sendPaymentSchema";
import TimePicker from "react-time-picker";
import Input from "components/ui/Input";

const EditScheduledPayment = () => {
  const navigate = useNavigate();
  const { upPaymentEntry, updateScheduledPayment } = useContext(
    ScheduledPaymentContext
  );
  const {
    is_group,
    name,
    amount,
    image,
    fees_total,
    payment_schedule_date,
    overall_specification,
  } = upPaymentEntry || {};

  const {
    contacts = [],
    sch_dt,
    sch_tm,
  } = useMemo(() => {
    if (!payment_schedule_date) return {};
    const sch_dt = new Date(payment_schedule_date);
    const sch_tm = sch_dt.toLocaleTimeString();
    const singleCont = { name, amount, image };
    const contacts = is_group === "1" || is_group ? [singleCont] : [];
    return { sch_dt, sch_tm, contacts };
  }, [payment_schedule_date]);

  const formik = useFormik({
    initialValues: {
      date: sch_dt || new Date(),
      time: sch_tm || "",
      specification: overall_specification || "",
    },
    validationSchema: schedulePaymentSchema,
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      const { date, time, specification } = values;
      const params = {
        schedule_date: `${date.toLocaleDateString("en-CA")} ${time}`,
        overall_specification: specification,
      };
    },
  });

  if (!upPaymentEntry) navigate("/view-schedule-payment");
  return (
    <>
      <div class="schedulepayment-sec">
        <div class="sp-top-sec">
          <div class="title-content-wrap common-title-wrap">
            <h3>Update Schedule Payment</h3>
            <p>Please select Payment date</p>
          </div>
        </div>
        <div class="sp-details-main-wrap">
          <div class="sp-details-left-wrap">
            <div class="sp-details-inner-wrap ">
              <ul>
                {contacts.map((item) => (
                  <PaymentUserItem
                    name={item.name}
                    profileImg={item.image}
                    amount={item.amount}
                  />
                ))}
              </ul>
            </div>
            <div class="sp-total-wrap d-flex flex-column gap-2">
              <div className="d-flex justify-content-between w-100">
                <div class="sp-total-text">Fees</div>
                <div class="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>0.00
                </div>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div class="sp-total-text">Amount</div>
                <div class="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>0.00
                </div>
              </div>
            </div>
            <div class="sp-btn-inner-wrap outline-solid-wrap">
              <button class="btn outline-btn">Cancel</button>
              <button class="btn" onClick={() => formik.submitForm()}>
                Update
              </button>
            </div>
          </div>
          <div class="sp-cal-wrap d-flex justify-content-center">
            <form onSubmit={formik.handleSubmit}>
              <div className="">
                <ReactDatePicker
                  className=""
                  selected={formik.values.date}
                  onChange={(date) => formik.setFieldValue("date", date)}
                  minDate={new Date()}
                  inline
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-danger pb-0">{formik.errors.date}</p>
                )}
              </div>
              <h1 className="text-center">
                {formik.values.date
                  .toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })
                  .replace(/-/g, " ")}
              </h1>
              <div className="row">
                <div className="col-12 col p-0">
                  <div className="form-field">
                    <TimePicker
                      className="w-full form-control"
                      value={formik.values.time}
                      onChange={(time) => formik.setFieldValue("time", time)}
                      clearIcon={null}
                      format="hh:mm:ss a"
                      maxDetail="second"
                      disableClock
                    />
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditScheduledPayment;
