import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import useBalance from "hooks/useBalance";
import useChartData from "hooks/useChartData";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { topUpSchema } from "schemas/validationSchema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalDateRangePicker from "components/modals/ModalDateRangePicker";
import ModalDatePicker from "components/modals/ModalDatePicker";

function RecurringPayment() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
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
    formik.setFieldValue("date", date);
    setShowDatePicker(false);
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
      country_code: "",
      mobile_number: "",
    },
    validationSchema: topUpSchema,
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);
      const mergedMobileNumber = `${values.country_code}${values.mobile_number}`;
      try {
        const { data } = await apiRequest.getCustomerDetail({
          mobile_number: mergedMobileNumber,
        });
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/top-up-details", {
          state: { customerDetails: data },
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

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Recurring Schedule Payment</h3>
          <Breadcrumb skipIndexes={[1]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form>
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
                          date={formik.values.date}
                          onClick={() => {
                            setShowDatePicker(true);
                          }}
                        />
                        {formik.touched.date && formik.errors.date ? (
                          <p className="text-danger pb-0">
                            {formik.errors.date}
                          </p>
                        ) : null}
                      </div>

                      <div className="row">
                        <div className="col-12 p-0">
                          <InputSelect
                            className="form-select form-control"
                            style={{ height: "60px" }}
                            name="select_frequency_id"
                            // onChange={handleCardDetailsChange}
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
                          className={`btn ${
                            activeButton === "occurrences"
                              ? "btn-recurring-occurrence-active"
                              : "btn-recurring-occurrence"
                          }`}
                          onClick={() => setActiveButton("occurrences")}
                        >
                          No of Occurrences
                        </button>
                        <button
                          className={`btn ${
                            activeButton === "endDate"
                              ? "recurring-end-date-active"
                              : "recurring-end-date"
                          }`}
                          onClick={() => setActiveButton("endDate")}
                        >
                          End date
                        </button>
                      </div>

                      <div className="main-wrapper">
                        <div className="button-wrapper">
                          <button>-</button>
                        </div>
                        <label className="number-label">0</label>
                        <div className="button-wrapper plus">
                          <button>+</button>
                        </div>
                      </div>

                      <div
                        className="common-dr-picker"
                        style={{ marginBottom: "15px", marginTop: "15px" }}
                      >
                        <InputDatePicker
                          className="date-filter-calendar-recurring"
                          date={formik.values.date}
                          onClick={() => {
                            setShowDatePicker(true);
                          }}
                        />
                        {formik.touched.date && formik.errors.date ? (
                          <p className="text-danger pb-0">
                            {formik.errors.date}
                          </p>
                        ) : null}
                      </div>

                      <div className="pay-btn-wrap">
                        <button
                          type="button"
                          onClick={() => {}}
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
          show={showDatePicker}
          setShow={setShowDatePicker}
          classNameChild={"schedule-time-modal"}
          heading="Date Filter"
          //   startDate={filters.startDate}
          //   endDate={filters.endDate}
          handleChangeDate={handleChangeDateFilter}
        />
      </div>
    </>
  );
}

export default RecurringPayment;
