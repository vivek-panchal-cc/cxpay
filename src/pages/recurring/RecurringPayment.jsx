import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import useBalance from "hooks/useBalance";
import useChartData from "hooks/useChartData";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { recurringSchema, topUpSchema } from "schemas/validationSchema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalDatePicker from "components/modals/ModalDatePicker";

function RecurringPayment() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [activeDatePicker, setActiveDatePicker] = useState("");
  const [activeButton, setActiveButton] = useState("occurrences");
  const [occurrenceCount, setOccurrenceCount] = useState(0);
  const [cardsList, setCardsList] = useState([]);
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);
  const [slideCard, setSlideCard] = useState({});
  const [activitiesList, setActivitiesList] = useState([]);
  const [loadingBalance, balance] = useBalance();
  const [loadingChart, chartData] = useChartData();
  const [countryList, cities] = useCountriesCities();

  const [modalDetails, setModalDetails] = useState({
    show: false,
    message: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    totalCharges: 0.0,
    grandTotal: 0.0,
    total: 0.0,
  });

  const handleChangeDateFilter = (date) => {
    if (activeDatePicker === "start") {
      formik.setFieldValue("start_date", date);
    } else if (activeDatePicker === "end") {
      formik.setFieldValue("end_date", date);
    }
    setActiveDatePicker("");
  };

  const handleSelectChange = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const incrementCount = () => {
    setOccurrenceCount((prevCount) => {
      const newCount = prevCount + 1;
      formik.setFieldValue("occurrence_count", newCount);
      return newCount;
    });
  };

  const decrementCount = () => {
    if (occurrenceCount > 0) {
      setOccurrenceCount((prevCount) => {
        const newCount = prevCount - 1;
        formik.setFieldValue("occurrence_count", newCount);
        return newCount;
      });
    }
  };

  const handleOccurrenceButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("occurrences");
    formik.setFieldValue("end_date", "");
  };

  const handleEndDateButtonClick = (e) => {
    e.preventDefault();
    setActiveButton("end_date");
    setOccurrenceCount(0);
    formik.setFieldValue("occurrence_count", 0);
  };

  const getActivitiesList = async (page = 1, filters = {}) => {
    try {
      const { data } = await apiRequest.activityList({ page, ...filters });
      if (!data.success) throw data.message;
      const { transactions } = data.data || {};
      const topFineTransact = transactions ? transactions.splice(0, 5) : [];
      setActivitiesList(topFineTransact);
    } catch (error) {
      console.log(error);
    }
  };

  const getCardsList = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      setCardsList(data.data.cards);
      setSlideCard(data.data.cards?.[0]);
    } catch (error) {
      setCardsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActivitiesList();
    getCardsList();
  }, []);

  const formik = useFormik({
    initialValues: {
      start_date: "",
      end_date: "",
      select_frequency_id: "",
      occurrence_count: 0,
    },
    validationSchema: recurringSchema,
    validateOnChange: true,
    validateOnBlur: true,
    context: { activeButton },
    onSubmit: async (values, { setErrors }) => {
      if (activeButton === "end_date" && !values.end_date) {
        setErrors({ end_date: "End date is required" });
        return;
      }
      setIsLoading(true);
      try {
        navigate("/send/recurring-payment-send", {
          state: { formData: values },
        });
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

  useEffect(() => {
    formik.validateForm();
  }, [activeButton]);

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Recurring Schedule Payment</h3>
          <Breadcrumb skipIndexes={[1]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-white-A700 flex flex-col font-visbyroundcf items-center justify-end mx-auto md:pr-10 pr-11 sm:pr-5 w-full">
              <div className="flex md:flex-col flex-row md:gap-10 items-start justify-between mx-auto w-full">
                <div className="flex md:flex-1 md:flex-col flex-row md:gap-5 items-start justify-evenly w-[79%] md:w-full">
                  <div className="flex flex-1 flex-col justify-start md:mt-0 mt-[174px] w-full">
                    <div className="flex flex-col items-start justify-start md:ml-[0] ml-[309px] w-[63%] md:w-full">
                      <label style={{ color: "#363853" }}>Start Date</label>

                      <div
                        className="common-dr-picker"
                        style={{ marginBottom: "15px", marginTop: "15px" }}
                      >
                        <InputDatePicker
                          className="date-filter-calendar-recurring"
                          date={formik.values.start_date}
                          onClick={() => {
                            setActiveDatePicker("start");
                          }}
                        />
                        {formik.touched.start_date &&
                        formik.errors.start_date ? (
                          <p className="text-danger pb-0">
                            {formik.errors.start_date}
                          </p>
                        ) : null}
                      </div>

                      <div className="row">
                        <div className="col-12 p-0">
                          <InputSelect
                            className="form-select form-control"
                            style={{ height: "60px", marginBottom: "15px" }}
                            name="select_frequency_id"
                            onChange={handleSelectChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.select_frequency_id}
                            error={
                              formik.touched.select_frequency_id &&
                              formik.errors.select_frequency_id
                            }
                          >
                            <option value="">Select Frequency</option>
                            <option key="1" value="monthly">
                              Monthly
                            </option>
                          </InputSelect>
                        </div>
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
                        >
                          No of Occurrences
                        </button>
                        <button
                          type="button"
                          className={`btn ${
                            activeButton === "end_date"
                              ? "btn-active"
                              : "btn-inactive"
                          }`}
                          onClick={handleEndDateButtonClick}
                        >
                          End date
                        </button>
                      </div>

                      {activeButton === "occurrences" && (
                        <div className="main-wrapper">
                          <div className="button-wrapper">
                            <button type="button" onClick={decrementCount}>
                              -
                            </button>{" "}
                          </div>
                          <label className="number-label">
                            {occurrenceCount}
                          </label>
                          <div className="button-wrapper plus">
                            <button type="button" onClick={incrementCount}>
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      {activeButton === "end_date" && (
                        <div
                          className="common-dr-picker"
                          style={{ marginBottom: "15px", marginTop: "15px" }}
                        >
                          <InputDatePicker
                            className="date-filter-calendar-recurring"
                            date={formik.values.end_date}
                            onClick={() => {
                              setActiveDatePicker("end");
                            }}
                          />
                          {formik.touched.end_date && formik.errors.end_date ? (
                            <p className="text-danger pb-0">
                              {formik.errors.end_date}
                            </p>
                          ) : null}
                        </div>
                      )}

                      <div className="pay-btn-wrap">
                        <button
                          type="button"
                          onClick={() => navigate("/send")}
                          className="btn btn-cancel-payment"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-send-payment"
                          disabled={formik.isSubmitting}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <ModalDatePicker
          show={activeDatePicker !== ""}
          setShow={() => setActiveDatePicker("")}
          classNameChild={"schedule-time-modal"}
          heading="Date Filter"
          handleChangeDate={handleChangeDateFilter}
        />
      </div>
    </>
  );
}

export default RecurringPayment;
