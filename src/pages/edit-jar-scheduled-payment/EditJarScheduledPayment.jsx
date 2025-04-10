import React, { useContext, useMemo } from "react";
import PaymentUserItem from "./components/PaymentUserItem";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CURRENCY_SYMBOL,
  isAdminApprovedWithRenewCheck,
  SCHEDULE_BUFFER,
} from "constants/all";
import { useFormik } from "formik";
import ReactDatePicker from "react-datepicker";
import TimePicker from "components/time-picker/TimePicker";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarSchedulePaymentSchema } from "schemas/jarSchema";
import Input from "components/ui/Input";

const EditJarScheduledPayment = () => {
  const navigate = useNavigate();
  const {
    scheduledPaymentDetails,
    updateJarScheduledPayment,
    setScheduledPaymentDetails,
  } = useContext(SavingJarOwnContext);
  const {
    id,
    jarId,
    is_group,
    name,
    amount,
    specifications,
    profile_image,
    payload,
    fees_total,
    payment_schedule_date,
  } = scheduledPaymentDetails || {};

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  const {
    contacts = [],
    sch_dt,
    sch_tm,
  } = useMemo(() => {
    if (!payment_schedule_date) return {};

    // Manually parsing the dateTime
    const [datePart, timePart] = payment_schedule_date.split(" ");
    const [year, month, day] = datePart
      .split("-")
      .map((str) => parseInt(str, 10));
    const [hour, minute, second] = timePart
      .split(":")
      .map((str) => parseInt(str, 10));

    const sch_dt = new Date(year, month - 1, day, hour, minute, second); // Constructing date object

    const sch_tm = sch_dt.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h12",
    });
    const singleCont = [
      { member_name: name, member_image: profile_image, member_amount: amount },
    ];
    const contacts =
      is_group && payload && payload.length > 0 ? payload : singleCont;
    const sch_amount = typeof amount === "number" ? amount : 0;
    return { sch_dt, sch_tm, contacts, sch_amount };
  }, [payment_schedule_date, is_group, payload, amount, fees_total]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: sch_dt || new Date(),
      time: sch_tm || "",
      amount: amount || 0,
      specifications: specifications || "",
    },
    validationSchema: jarSchedulePaymentSchema,
    onSubmit: async (values) => {
      const { date, time } = values;
      const dt = new Date(`${date.toDateString()} ${time}`);
      const dts = dt.toLocaleDateString("en-CA");
      const tms = dt.toLocaleTimeString(undefined, { hourCycle: "h24" });
      const params = {
        jar_id: jarId,
        payment_id: id,
        schedule_date: `${dts} ${tms}`,
        amount: values.amount,
        specifications: values.specifications,
      };
      try {
        await updateJarScheduledPayment(params);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleCancel = () => {
    setScheduledPaymentDetails({});
    navigate("/jars/own/jar-schedule-pay-list");
  };

  if (!scheduledPaymentDetails.jarId)
    return <Navigate to="/jars/own" replace />;
  return (
    <>
      <div className="schedulepayment-sec" style={{ marginBottom: "200px" }}>
        <div className="sp-top-sec">
          <div className="title-content-wrap common-title-wrap">
            <h2>Update Sub-account Schedule Payment</h2>
            <ul className="breadcrumb">
              <li>
                <Link to={`/jars/own/jar-schedule-pay-list`}>Sub-accounts</Link>
              </li>
              <li>Update</li>
            </ul>
            {/* <p>Please select Payment date</p> */}
          </div>
        </div>
        <div className="sp-details-main-wrap justify-content-center">
          <div className="sp-details-left-wrap d-flex flex-wrap justify-content-center p-0">
            {/* <div className="sp-details-inner-wrap ml-0">
              <ul>
                {contacts?.map((item, index) => {
                  const profileURL = item.member_image;
                  // ? item.member_image
                  // : "/assets/images/single_contact_profile.png";
                  return (
                    <PaymentUserItem
                      key={item?.member_amount || index}
                      name={item.member_name}
                      profileImg={profileURL}
                      amount={item.member_amount}
                      isDeleted={item.is_deleted}
                    />
                  );
                })}
              </ul>
            </div> */}
            <div className="sp-cal-wrap d-flex justify-content-center w-100">
              <form onSubmit={formik.handleSubmit}>
                <div className="col-12 p-0 amt-with-currency">
                  <span>{CURRENCY_SYMBOL}</span>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    className="form-control"
                    name="amount"
                    // maxLength="6"
                    placeholder="Amount"
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimals

                      // Prevent more than one decimal point
                      const decimalCount = (value.match(/\./g) || []).length;
                      if (decimalCount > 1) {
                        value = value.slice(0, -1); // Remove extra decimal point
                      }

                      // Allow only up to 6 digits before the decimal point
                      const [integerPart, decimalPart] = value.split(".");
                      if (integerPart.length <= 6) {
                        if (decimalPart && decimalPart.length > 2) {
                          // Limit to two decimal places
                          formik.setFieldValue(
                            "amount",
                            integerPart + "." + decimalPart.slice(0, 2)
                          );
                        } else {
                          formik.setFieldValue("amount", value);
                        }
                      } else {
                        formik.setFieldValue(
                          "amount",
                          integerPart.slice(0, 6) +
                            (decimalPart ? `.${decimalPart.slice(0, 2)}` : "")
                        );
                      }
                    }}
                    onBlur={(e) => {
                      let value = e.target.value.trim();

                      if (!value || value === ".") {
                        value = "0.00"; // If the field is empty or just a '.', set it to "0.00"
                      } else {
                        const hasDecimal = value.includes(".");
                        // If there's no decimal point, add ".00"
                        if (!hasDecimal) {
                          value += ".00";
                        } else {
                          const parts = value.split(".");
                          if (parts[1].length === 0) {
                            value += "00"; // Add two zeroes if there are no decimal digits
                          } else if (parts[1].length === 1) {
                            value += "0"; // Add one zero if there's only one decimal digit
                          } else if (parts[1].length > 2) {
                            value = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to two decimal places
                          }
                        }
                      }

                      formik.setFieldValue("amount", value);
                      formik.handleBlur(e);
                    }}
                    value={formik.values.amount}
                    error={formik.touched.amount && formik.errors.amount}
                  />
                </div>
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Specification"
                  name="specifications"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.specifications}
                  error={
                    formik.touched.specifications &&
                    formik.errors.specifications
                  }
                />
                <div className="common-dr-picker">
                  <ReactDatePicker
                    className=""
                    selected={formik.values.date}
                    onChange={(date) => formik.setFieldValue("date", date)}
                    minDate={new Date()}
                    inline
                  />
                  {formik.touched.date && formik.errors.date ? (
                    <p className="text-danger pb-0">{formik.errors.date}</p>
                  ) : null}
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
                        classNameInput="w-full form-control"
                        minutesSelection="quater"
                        bufferTime={SCHEDULE_BUFFER}
                        selecteDate={formik.values.date}
                        selectedTime={sch_tm}
                        onChange={(time) => formik.setFieldValue("time", time)}
                      />
                      {formik.touched.time && formik.errors.time ? (
                        <p className="text-danger pb-0">{formik.errors.time}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {adminApprovedWithRenewCheck ? (
              <div
                className="sp-btn-inner-wrap outline-solid-wrap flex-recurring-update justify-content-center w-100"
                style={{ maxWidth: "450px" }}
              >
                <button
                  className="btn outline-btn w-100 mb-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn w-100 mb-2"
                  onClick={formik.handleSubmit}
                  disabled={formik.isSubmitting}
                >
                  Update
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditJarScheduledPayment;
