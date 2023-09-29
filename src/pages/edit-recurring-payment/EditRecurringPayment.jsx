import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import PaymentUserItem from "./components/PaymentUserItem";
import { RecurringPaymentContext } from "context/recurringPaymentContext";
import { useNavigate } from "react-router-dom";
import { CURRENCY_SYMBOL, SCHEDULE_BUFFER } from "constants/all";
import { useFormik } from "formik";
import { schedulePaymentSchemaRecurringForUpdate } from "schemas/sendPaymentSchema";
import Input from "components/ui/Input";
import WrapAmount from "components/wrapper/WrapAmount";
import InputDatePicker from "components/ui/InputDatePicker";
import InputSelect from "components/ui/InputSelect";
import ModalDatePicker from "components/modals/ModalDatePicker";
import InputNumber from "components/ui/InputNumber";
import ModalConfirmation from "components/modals/ModalConfirmation";

const EditRecurringPayment = () => {
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState("");
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);
  const [occurrenceCount, setOccurrenceCount] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const { upPaymentEntry, updateRecurringPayment, cancelUpdatePayment } =
    useContext(RecurringPaymentContext);
  const {
    id,
    is_group,
    name,
    amount,
    image,
    payload,
    fees_total,
    created_date,
    overall_specification,
    no_of_occurrence,
    recurring_end_date,
    recurring_start_date,
    frequency,
    set_recurring_flag,
  } = upPaymentEntry || {};
  const [selectedFrequency, setSelectedFrequency] = useState(frequency);
  const [activeButton, setActiveButton] = useState(
    set_recurring_flag === "DATE" ? "recurring_end_date" : "occurrences"
  );
  const myInputRef = useRef(null);

  useEffect(() => {
    const preventPageScroll = (e) => {
      if (document.activeElement === myInputRef.current) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", preventPageScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", preventPageScroll);
    };
  }, []);

  const convertToUSDateFormat = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${month}/${day}/${year}`;
  };

  const handleChangeDateFilter = (date) => {
    if (activeDatePicker === "start") {
      formik.setFieldValue("recurring_start_date", date);
      setStartDate(new Date(date));
      formik.setFieldValue("recurring_end_date", "");
    } else if (activeDatePicker === "end") {
      formik.setFieldValue("recurring_end_date", date);
    }
    setActiveDatePicker("");
  };

  const handleSelectChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const incrementCount = () => {
    if (formik.values.no_of_occurrence < 99) {
      const newCount = formik.values.no_of_occurrence + 1;
      formik.setFieldValue("no_of_occurrence", newCount);
    }
  };

  const decrementCount = () => {
    if (formik.values.no_of_occurrence > 1) {
      const newCount = formik.values.no_of_occurrence - 1;
      formik.setFieldValue("no_of_occurrence", newCount);
    }
  };

  const handleOccurrenceButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("occurrences");
    // formik.setFieldValue("recurring_end_date", "");
  };

  const handleEndDateButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("recurring_end_date");
    setOccurrenceCount(0);
    // formik.setFieldValue("no_of_occurrence", 0);
  };

  const {
    contacts = [],
    sch_dt,
    sch_amount,
    sch_fees,
    sch_total,
  } = useMemo(() => {
    if (!created_date) return {};
    const sch_dt = new Date(convertToUSDateFormat(created_date));
    const singleCont = [
      { member_name: name, member_image: image, member_amount: amount },
    ];
    const contacts =
      is_group && payload && payload.length > 0 ? payload : singleCont;
    const sch_amount = typeof amount === "number" ? amount : 0;
    const sch_fees = typeof fees_total === "number" ? fees_total : 0;
    const sch_total = sch_amount + sch_fees;
    return { sch_dt, contacts, sch_amount, sch_fees, sch_total };
  }, [created_date, is_group, payload, amount, fees_total]);

  const formatDateToMDY = (input) => {
    let date;

    if (input instanceof Date) {
      date = input;
    } else if (typeof input === "string") {
      if (!input) return "";

      if (input.includes("-")) {
        const [year, month, day] = input.split("-");
        date = new Date(year, month - 1, day);
      } else if (input.includes("/")) {
        const [day, month, year] = input.split("/");
        date = new Date(year, month - 1, day);
      } else {
        return ""; // Return an empty string or another default value
      }
    } else {
      console.warn("Expected a string or Date format. Received:", input);
      return "";
    }

    const formattedMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Ensures it is two digits
    const formattedDay = ("0" + date.getDate()).slice(-2); // Ensures it is two digits
    const formattedYear = date.getFullYear();

    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  };

  const handleFrequencyClick = (frequency) => {
    setSelectedFrequency(frequency);
    formik.setFieldValue("frequency", frequency);
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleScheduleSubmit = async (scheduleDetails) => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      setScrollTop((cs) => !cs);
      return;
    }

    // Extract the date part only (to avoid time comparison)
    const today = new Date();
    const todayDateStr = formatDate(today);
    const startDateObj = new Date(formik.values.recurring_start_date);
    const startDateStr = formatDate(startDateObj);

    // Check if recurring_start_date is equal to the current date
    if (startDateStr === todayDateStr) {
      if (
        activeButton === "recurring_end_date" &&
        !formik.values.recurring_end_date
      ) {
        formik.setErrors({
          ...formik.errors,
          recurring_end_date: "End date is required",
        });
        return;
      }
      setShowScheduleConfirmPopup(true); // Show the popup otherwise
    } else {
      formik.handleSubmit();
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // specification: overall_specification || "",
      no_of_occurrence: no_of_occurrence || 0,
      recurring_end_date: recurring_end_date || "",
      recurring_start_date: recurring_start_date || "",
      frequency: frequency || "",
    },
    validationSchema: schedulePaymentSchemaRecurringForUpdate,
    validateOnChange: true,
    validateOnBlur: true,
    context: { activeButton },
    validate: (values) => {
      let errors = {};
      if (activeButton === "occurrences" && values.no_of_occurrence <= 0) {
        errors.no_of_occurrence = "Occurrence must be greater than 0";
      }
      if (values.recurring_start_date && values.recurring_end_date) {
        const startDate = new Date(values.recurring_start_date);
        const endDate = new Date(values.recurring_end_date);
        const timeDiff = endDate - startDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        switch (values.frequency) {
          case "daily":
            if (daysDiff < 1) {
              errors.recurring_end_date =
                "For daily frequency, end date should be at least 1 day after start date.";
            }
            break;
          case "weekly":
            if (daysDiff < 7) {
              errors.recurring_end_date =
                "For weekly frequency, end date should be at least 7 days after start date.";
            }
            break;
          case "monthly":
            if (daysDiff < 28) {
              // or 30 if you prefer
              errors.recurring_end_date =
                "For monthly frequency, end date should be at least 28 days after start date.";
            }
            break;
          case "yearly":
            if (daysDiff < 365) {
              errors.recurring_end_date =
                "For yearly frequency, end date should be at least 365 days after start date.";
            }
            break;
          default:
            break;
        }
      }
      return errors;
    },
    onSubmit: async (values, { setErrors, setValues, setStatus }) => {
      if (activeButton === "recurring_end_date" && !values.recurring_end_date) {
        setErrors({ recurring_end_date: "End date is required" });
        return;
      }
      const {
        // specification,
        no_of_occurrence,
        recurring_end_date,
        recurring_start_date,
        frequency,
      } = values;
      const params = {
        recurring_payment_id: id,
        // overall_specification: specification,
        no_of_occurrence: no_of_occurrence.toString(),
        recurring_end_date: formatDateToMDY(recurring_end_date),
        recurring_start_date: formatDateToMDY(recurring_start_date),
        frequency: frequency,
      };
      try {
        await updateRecurringPayment(params);
      } catch (error) {
        console.log(error);
      }
      finally{
        setShowScheduleConfirmPopup(false);
      }
    },
  });

  if (!upPaymentEntry) navigate("/view-recurring-payment");
  return (
    <>
      <div className="schedulepayment-sec" style={{ marginBottom: "200px" }}>
        <div className="sp-top-sec">
          <div className="title-content-wrap common-title-wrap">
            <h3>Update Recurring Payment</h3>
            <p>Please select Payment date</p>
          </div>
        </div>
        <div className="recurring-sp-details-main-wrap">
          <div className="recurring-sp-details-left-wrap">
            <div className="recurring-sp-details-inner-wrap">
              <ul>
                {contacts?.map((item, index) => {
                  const profileURL = item.member_image
                    ? item.member_image
                    : "/assets/images/single_contact_profile.png";
                  return (
                    <PaymentUserItem
                      key={item?.member_amount || index}
                      name={item.member_name}
                      profileImg={profileURL}
                      amount={item.member_amount}
                      groupAmount={item.amount}
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
                  <WrapAmount value={sch_amount} prefix={""} />
                </div>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div className="sp-total-text">Fees</div>
                <div className="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>
                  <WrapAmount value={sch_fees} prefix={""} />
                </div>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div className="sp-total-text">Total</div>
                <div className="sp-total-amt">
                  <span>{CURRENCY_SYMBOL}</span>
                  <WrapAmount value={sch_total} prefix={""} />
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
                // onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
                onClick={handleScheduleSubmit}
              >
                Update Recurring
              </button>
            </div>
          </div>
          <div className="recurring-sp-cal-wrap d-flex justify-content-center">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="flex flex-col items-start justify-start md:ml-[0] ml-[309px] w-[63%] md:w-full">
                  <div
                    className="common-dr-picker"
                    style={{ marginBottom: "15px", marginTop: "15px" }}
                  >
                    <label className="rec-label-class">Start Date</label>
                    <InputDatePicker
                      className="date-filter-calendar-recurring"
                      date={formik.values.recurring_start_date}
                      onClick={() => {
                        setActiveDatePicker("start");
                      }}
                    />
                    {formik.touched.recurring_start_date &&
                    formik.errors.recurring_start_date ? (
                      <p className="text-danger pb-0">
                        {formik.errors.recurring_start_date}
                      </p>
                    ) : null}
                  </div>

                  {/* <div className="row">
                    <div className="col-12 p-0">
                      <InputSelect
                        className="form-select form-control"
                        style={{ height: "60px", marginBottom: "15px" }}
                        name="frequency"
                        onChange={handleSelectChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.frequency}
                        error={
                          formik.touched.frequency && formik.errors.frequency
                        }
                      >
                        <option value="">Select Frequency</option>
                        <option key="yearly" value="yearly">
                          Yearly
                        </option>
                        <option key="monthly" value="monthly">
                          Monthly
                        </option>
                        <option key="weekly" value="weekly">
                          Weekly
                        </option>
                        <option key="daily" value="daily">
                          Daily
                        </option>
                      </InputSelect>
                    </div>
                  </div> */}

                  <label className="rec-label-class">Frequency</label>
                  <div className="frequency-buttons">
                    {["daily", "weekly", "monthly", "yearly"].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        className={`btn ${
                          selectedFrequency === freq
                            ? "btn-freqActive"
                            : "btn-freqInactive"
                        }`}
                        onClick={() => handleFrequencyClick(freq)}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="recurring-occurrence">
                    <button
                      type="button"
                      className={`btn ${
                        activeButton === "occurrences"
                          ? "btn-active"
                          : "btn-inactive"
                      }`}
                      onClick={handleOccurrenceButtonClick}
                      disabled={set_recurring_flag === "DATE"}
                    >
                      No of Occurrences
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeButton === "recurring_end_date"
                          ? "btn-active"
                          : "btn-inactive"
                      }`}
                      onClick={handleEndDateButtonClick}
                      disabled={set_recurring_flag === "OCCURRENCE"}
                    >
                      End date
                    </button>
                  </div>

                  {activeButton === "occurrences" && (
                    <div className="row">
                      <div className="col-6 col p-0">
                        <div className="form-field">
                          <InputNumber
                            ref={myInputRef}
                            type="number"
                            min="1"
                            max="99"
                            className="form-control"
                            placeholder="No. of occurrences"
                            name="no_of_occurrence"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.no_of_occurrence}
                            error={
                              formik.touched.no_of_occurrence &&
                              formik.errors.no_of_occurrence
                            }
                          />
                        </div>
                      </div>
                    </div>
                    // <div>
                    //   <div className="main-wrapper">
                    //     <div className="button-wrapper">
                    //       <button type="button" onClick={decrementCount}>
                    //         -
                    //       </button>{" "}
                    //     </div>
                    //     <label className="number-label">
                    //       {formik.values.no_of_occurrence}
                    //     </label>
                    //     <div className="button-wrapper plus">
                    //       <button type="button" onClick={incrementCount}>
                    //         +
                    //       </button>
                    //     </div>
                    //   </div>
                    //   {formik.touched.no_of_occurrence &&
                    //   formik.errors.no_of_occurrence ? (
                    //     <p className="text-danger pb-0">
                    //       {formik.errors.no_of_occurrence}
                    //     </p>
                    //   ) : null}
                    // </div>
                  )}

                  {activeButton === "recurring_end_date" && (
                    <div
                      className="common-dr-picker"
                      style={{ marginBottom: "15px", marginTop: "15px" }}
                    >
                      <InputDatePicker
                        className="date-filter-calendar-recurring"
                        date={formik.values.recurring_end_date}
                        onClick={() => {
                          setActiveDatePicker("end");
                        }}
                      />
                      {formik.touched.recurring_end_date &&
                      formik.errors.recurring_end_date ? (
                        <p className="text-danger pb-0">
                          {formik.errors.recurring_end_date}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
                {/* <label style={{ color: "#363853", marginBottom: "15px" }}>
                  Specification
                </label>
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
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ModalDatePicker
        minDate={
          activeDatePicker === "start"
            ? new Date()
            : new Date(formik.values.recurring_start_date)
        }
        show={activeDatePicker !== ""}
        setShow={() => setActiveDatePicker("")}
        classNameChild={"schedule-time-modal"}
        heading="Date Filter"
        handleChangeDate={handleChangeDateFilter}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showScheduleConfirmPopup}
        setShow={setShowScheduleConfirmPopup}
        heading={"Are you sure want to schedule this recurring payment?"}
        subHeading={
          "From selected current date, your recurring schedule payment will be executed now."
        }
        handleCallback={formik.handleSubmit}
      />
    </>
  );
};

export default EditRecurringPayment;
