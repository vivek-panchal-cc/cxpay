import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import PaymentUserItem from "./components/PaymentUserItem";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import { useFormik } from "formik";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { useSelector } from "react-redux";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import { LoginContext } from "context/loginContext";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarRecurringForUpdate } from "schemas/jarSchema";

const EditJarRecurringPayment = () => {
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState("");
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);

  const [startDate, setStartDate] = useState(null);
  const {
    recurringPaymentDetails,
    updateJarRecurringPayment,
    setRecurringPaymentDetails,
  } = useContext(SavingJarOwnContext);
  const {
    id,
    jarId,
    is_group,
    name,
    amount,
    profile_image,
    payload,
    fees_total,
    created_at,
    overall_specification,
    no_of_occurrence,
    recurring_end_date,
    recurring_start_date,
    frequency,
    set_recurring_flag,
  } = recurringPaymentDetails || {};
  const [selectedFrequency, setSelectedFrequency] = useState(frequency);
  const [activeButton, setActiveButton] = useState("recurring_end_date");
  const myInputRef = useRef(null);
  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

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

  const {
    contacts = [],
    sch_dt,
    sch_amount,
    sch_fees,
    sch_total,
  } = useMemo(() => {
    if (!recurring_start_date) return {};
    const sch_dt = new Date(convertToUSDateFormat(recurring_start_date));
    const singleCont = [
      { member_name: name, member_image: profile_image, member_amount: amount },
    ];
    const contacts =
      is_group && payload && payload.length > 0 ? payload : singleCont;
    const sch_amount = typeof amount === "number" ? amount : 0;
    const sch_fees = typeof fees_total === "number" ? fees_total : 0;
    const sch_total = sch_amount + sch_fees;
    return { sch_dt, contacts, sch_amount, sch_fees, sch_total };
  }, [recurring_start_date, is_group, payload, amount, fees_total]);

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

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
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

  const handleCancel = () => {
    setRecurringPaymentDetails({});
    navigate("/jars/own/jar-recurring-pay-list", { replace: true });
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
      recurring_end_date: recurring_end_date || "",
      recurring_start_date: recurring_start_date || "",
      frequency: frequency || "",
    },
    validationSchema: jarRecurringForUpdate,
    validateOnChange: true,
    validateOnBlur: true,
    context: { activeButton },
    validate: (values) => {
      let errors = {};
      if (
        values.recurring_start_date &&
        values.recurring_end_date &&
        set_recurring_flag === "DATE"
      ) {
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
      const { recurring_end_date, recurring_start_date, frequency } = values;
      const params = {
        payment_id: id,
        jar_id: jarId,
        recurring_end_date: formatDateToMDY(recurring_end_date),
        recurring_start_date: formatDateToMDY(recurring_start_date),
        frequency: frequency,
      };
      try {
        await updateJarRecurringPayment(params);
      } catch (error) {
        console.log(error);
      } finally {
        setShowScheduleConfirmPopup(false);
      }
    },
  });

  if (!recurringPaymentDetails.id)
    return <Navigate to="/jars/own/jar-recurring-pay-list" replace />;
  return (
    <>
      <div className="schedulepayment-sec">
        <div className="sp-top-sec" style={{ paddingTop: "20px" }}>
          <div className="title-content-wrap common-title-wrap">
            <h3>Update Sub-account Recurring Payment</h3>
            <ul className="breadcrumb">
              <li>
                <Link to={`/jars/own/jar-recurring-pay-list`}>
                  Sub-accounts
                </Link>
              </li>
              <li>Update</li>
            </ul>
          </div>
        </div>
        <div className="jar-recurring-sp-details-main-wrap justify-content-center">
          <div className="recurring-sp-details-left-wrap">
            <div className="jar-recurring-sp-details-inner-wrap">
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
                      groupAmount={item.amount}
                      isDeleted={item.is_deleted}
                    />
                  );
                })}
              </ul>
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

                    <label className="rec-label-class">Frequency</label>
                    <div className="jar-frequency-buttons">
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

                    {activeButton === "recurring_end_date" && (
                      <div
                        className="common-dr-picker"
                        style={{ marginBottom: "15px", marginTop: "15px" }}
                      >
                        <label className="rec-label-class">End Date</label>
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
                    {adminApprovedWithRenewCheck ? (
                      <div className="sp-btn-inner-wrap outline-solid-wrap flex-recurring-update">
                        <button
                          type="button"
                          className="btn w-100 mb-2"
                          disabled={formik.isSubmitting}
                          onClick={handleScheduleSubmit}
                        >
                          Update Recurring
                        </button>
                        <button
                          type="button"
                          className="btn outline-btn w-100 mb-2"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ModalDatePickerKyc
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

export default EditJarRecurringPayment;
