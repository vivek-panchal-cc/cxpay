import React, { useContext, useMemo } from "react";
import PaymentUserItem from "./components/PaymentUserItem";
import { ScheduledPaymentContext } from "context/scheduledPaymentContext";
import { useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL, SCHEDULE_BUFFER } from "constants/all";
import { useFormik } from "formik";
import ReactDatePicker from "react-datepicker";
import { schedulePaymentSchema } from "schemas/sendPaymentSchema";
import Input from "components/ui/Input";
import TimePicker from "components/time-picker/TimePicker";
import { uniqueId } from "helpers/commonHelpers";

const EditScheduledPayment = () => {
  const navigate = useNavigate();
  const { upPaymentEntry, updateScheduledPayment, cancelUpdatePayment } =
    useContext(ScheduledPaymentContext);
  const {
    id,
    is_group,
    name,
    amount,
    image,
    payload,
    fees_total,
    payment_schedule_date,
    overall_specification,
  } = upPaymentEntry || {};

  const dtTimeBuffer = useMemo(() => {
    const dtm15 = new Date().getTime() + 1000 * 60 * SCHEDULE_BUFFER;
    return new Date(dtm15);
  }, []);

  const {
    contacts = [],
    sch_dt,
    sch_tm,
    sch_amount,
    sch_fees,
    sch_total,
  } = useMemo(() => {
    if (!payment_schedule_date) return {};
    const sch_dt = new Date(payment_schedule_date);
    const sch_tm = sch_dt.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h12",
    });
    const singleCont = [
      { member_name: name, member_image: image, member_amount: amount },
    ];
    const contacts =
      is_group === "1" && payload && payload.length > 0 ? payload : singleCont;
    const sch_amount = amount ? parseFloat(amount) : 0;
    const sch_fees = fees_total ? parseFloat(fees_total) : 0;
    const sch_total = sch_amount + sch_fees;
    return { sch_dt, sch_tm, contacts, sch_amount, sch_fees, sch_total };
  }, [payment_schedule_date, is_group, payload, amount, fees_total]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: sch_dt || new Date(),
      time: sch_tm || "",
      specification: overall_specification || "",
    },
    validationSchema: schedulePaymentSchema,
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      const { date, time, specification } = values;
      const dt = new Date(`${date.toDateString()} ${time}`);
      const dts = dt.toLocaleDateString("en-CA");
      const tms = dt.toLocaleTimeString(undefined, { hourCycle: "h24" });
      const params = {
        schedule_payment_id: id,
        schedule_date: `${dts} ${tms}`,
        overall_specification: specification,
      };
      try {
        await updateScheduledPayment(params);
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (!upPaymentEntry) navigate("/view-schedule-payment");
  return (
    <>
      <div className="schedulepayment-sec" style={{ marginBottom: "200px" }}>
        <div className="sp-top-sec">
          <div className="title-content-wrap common-title-wrap">
            <h3>Update Schedule Payment</h3>
            <p>Please select Payment date</p>
          </div>
        </div>
        <div className="sp-details-main-wrap">
          <div className="sp-details-left-wrap">
            <div className="sp-details-inner-wrap ">
              <ul>
                {contacts?.map((item) => {
                  const uid = uniqueId();
                  const profileURL = item.member_image
                    ? item.member_image
                    : "/assets/images/single_contact_profile.png";
                  return (
                    <PaymentUserItem
                      key={uid}
                      name={item.member_name}
                      profileImg={profileURL}
                      amount={item.member_amount}
                    />
                  );
                })}
              </ul>
            </div>
            <div className="sp-total-wrap d-flex flex-column gap-2">
              <div className="d-flex justify-content-between w-100">
                <div className="sp-total-text">Amount</div>
                <div className="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>
                  {sch_amount?.toFixed(2)}
                </div>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div className="sp-total-text">Fees</div>
                <div className="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>
                  {sch_fees?.toFixed(2)}
                </div>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div className="sp-total-text">Total</div>
                <div className="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>
                  {sch_total?.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="sp-btn-inner-wrap outline-solid-wrap">
              <button className="btn outline-btn" onClick={cancelUpdatePayment}>
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                onClick={formik.handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
          <div className="sp-cal-wrap d-flex justify-content-center">
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
                      minutesSelection="quater"
                      value={formik.values.time}
                      selecteDate={formik.values.date}
                      fromDate={dtTimeBuffer}
                      onChange={(time) => formik.setFieldValue("time", time)}
                      classNameInput="w-full form-control"
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
