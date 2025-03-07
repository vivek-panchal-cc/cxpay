import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import InputNumber from "components/ui/InputNumber";
import { LoaderContext } from "context/loaderContext";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { recurringSchema } from "schemas/validationSchema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { useSelector } from "react-redux";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import { LoginContext } from "context/loginContext";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { jarRecurringSchema } from "schemas/jarSchema";

function JarRecurringSend() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState("");
  const [activeButton, setActiveButton] = useState("recurring_end_date");
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [occurrenceCount, setOccurrenceCount] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [showScheduleConfirmPopup, setShowScheduleConfirmPopup] =
    useState(false);

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
    sendCreds,
    prevPathRedirect,
    cancelOwnJarPayment,
    handleRecurringSendPayment,
    handleRecurringPaymentForAddAmountToPay,
  } = useContext(SavingJarOwnContext);
  const { wallet } = sendCreds || [];

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

  const handleChangeDateFilter = (date) => {
    if (activeDatePicker === "start") {
      formik.setFieldValue("recurring_start_date", date);
      setStartDate(date);
      formik.setFieldValue("recurring_end_date", "");
    } else if (activeDatePicker === "end") {
      formik.setFieldValue("recurring_end_date", date);
    }
    setActiveDatePicker("");
  };

  const handleOccurrenceButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("occurrences");
    formik.setFieldValue("recurring_end_date", "");
  };

  const handleEndDateButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("recurring_end_date");
    setOccurrenceCount(0);
    formik.setFieldValue("occurrence_count", 0);
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

  const handleScheduleSubmit = async () => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      return;
    }

    // Extract the date part only (to avoid time comparison)
    const today = new Date();
    const todayDateStr = formatDate(today);
    const startDateObj = new Date(formik.values.recurring_start_date);
    const startDateStr = formatDate(startDateObj);

    // Check if recurring_start_date is equal to the current date
    if (startDateStr === todayDateStr) {
      setShowScheduleConfirmPopup(true); // Show the popup otherwise
    } else {
      handleConfirmRecurringSubmit(); // Directly execute the handleConfirmRecurringSubmit if recurring_start_date is today
    }
  };

  const formik = useFormik({
    initialValues: {
      recurring_start_date: "",
      recurring_end_date: "",
      frequency: "daily",
      occurrence_count: "1",
    },
    validationSchema: jarRecurringSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    context: { activeButton },
    validate: (values) => {
      let errors = {};
      if (activeButton === "occurrences" && values.occurrence_count <= 0) {
        errors.occurrence_count = "Occurrence must be greater than 0";
      }
      if (activeButton === "recurring_end_date" && !values.recurring_end_date) {
        errors.recurring_end_date = "End date is required";
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
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);
      try {
        if (wallet.jar_id) {
          handleRecurringPaymentForAddAmountToPay({
            ...formik.values,
            schedule_date: new Date().toISOString().split("T")[0], // Adds current date in YYYY-MM-DD format
          });
        } else {
          handleRecurringSendPayment({
            ...formik.values,
            schedule_date: new Date().toISOString().split("T")[0], // Adds current date in YYYY-MM-DD format
          });
        }
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        const errorObj = {};
        for (const property in error) errorObj[property] = error[property]?.[0];
        setErrors(errorObj);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleConfirmRecurringSubmit = async () => {
    const validateObj = await formik.validateForm(formik.values);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      return;
    }

    setIsLoading(true);
    try {
      if (wallet.jar_id) {
        handleRecurringPaymentForAddAmountToPay({
          ...formik.values,
          schedule_date: new Date().toISOString().split("T")[0], // Adds current date in YYYY-MM-DD format
        });
      } else {
        handleRecurringSendPayment({
          ...formik.values,
          schedule_date: new Date().toISOString().split("T")[0], // Adds current date in YYYY-MM-DD format
        });
      }
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
      const errorObj = {};
      for (const property in error) errorObj[property] = error[property]?.[0];
      formik.setErrors(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/jars/own/create-jar", { replace: true });
    cancelOwnJarPayment();
  };

  const parseTargetDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("-"); // Split "07-03-2025" into [07, 03, 2025]
    return new Date(`${year}-${month}-${day}`); // Convert to "2025-03-07"
  };

  useEffect(() => {
    formik.validateForm();
  }, [activeButton]);

  useEffect(() => {
    // Check if the wallet array is empty and navigate accordingly
    if (!sendCreds?.wallet || sendCreds.wallet.length <= 0) {
      navigate(prevPathRedirect || "/jars/own", { replace: true });
    }
  }, [sendCreds, navigate, prevPathRedirect]);

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Recurring Schedule Payment</h3>
          <Breadcrumb skipIndexes={[2]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-white-A700 flex flex-col font-visbyroundcf items-center justify-end mx-auto md:pr-10 pr-11 sm:pr-5 w-full">
              <div className="flex md:flex-col flex-row md:gap-10 items-start justify-between mx-auto w-full">
                <div className="flex md:flex-1 md:flex-col flex-row md:gap-5 items-start justify-evenly w-[79%] md:w-full">
                  <div className="flex flex-1 flex-col justify-start md:mt-0 mt-[174px] w-full">
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
                      <div className="frequency-buttons">
                        {["daily", "weekly", "monthly", "yearly"].map(
                          (freq) => (
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
                          )
                        )}
                      </div>

                      <div className="recurring-occurrence">
                        <button
                          type="button"
                          className={`btn ${
                            activeButton === "occurrences"
                              ? "btn-active"
                              : "btn-inactive"
                          }`}
                          //   onClick={handleOccurrenceButtonClick}
                          disabled
                        >
                          No. of Occurrences
                        </button>
                        <button
                          type="button"
                          className={`btn ${
                            activeButton === "recurring_end_date"
                              ? "btn-active"
                              : "btn-inactive"
                          }`}
                          onClick={handleEndDateButtonClick}
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
                                name="occurrence_count"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.occurrence_count}
                                error={
                                  formik.touched.occurrence_count &&
                                  formik.errors.occurrence_count
                                }
                              />
                            </div>
                          </div>
                        </div>
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

                      {adminApprovedWithRenewCheck ? (
                        <div className="pay-btn-wrap">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-cancel-payment"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-send-payment"
                            disabled={formik.isSubmitting}
                            onClick={handleScheduleSubmit}
                          >
                            Next
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <ModalDatePickerKyc
          minDate={activeDatePicker === "start" ? new Date() : startDate}
          show={activeDatePicker !== ""}
          setShow={() => setActiveDatePicker("")}
          classNameChild={"schedule-time-modal"}
          heading="Date Filter"
          handleChangeDate={handleChangeDateFilter}
          maxDate={
            wallet.target_date ? parseTargetDate(wallet.target_date) : null
          }
        />
        <ModalConfirmation
          id="delete-group-member-popup"
          show={showScheduleConfirmPopup}
          setShow={setShowScheduleConfirmPopup}
          heading={"Are you sure want to schedule this recurring payment?"}
          subHeading={
            "From selected current date, your recurring schedule payment will be executed now."
          }
          handleCallback={handleConfirmRecurringSubmit}
        />
      </div>
    </>
  );
}

export default JarRecurringSend;
