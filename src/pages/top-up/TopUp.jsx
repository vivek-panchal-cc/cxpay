import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import Input from "components/ui/Input";
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

function TopUp() {
  const { setIsLoading } = useContext(LoaderContext);
  const navigate = useNavigate();
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
          <h3>Top-Up</h3>
          <Breadcrumb skipIndexes={[1]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-12 p-0">
                <div className="form-field">
                  <p className="text-dark mb-2">
                    Please enter following details to Top-up
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3 ps-0">
                <InputSelect
                  className="form-select form-control"
                  name="country_code"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country_code}
                  error={
                    formik.touched.country_code && formik.errors.country_code
                  }
                >
                  <option value={""}>Country</option>
                  {countryList?.map((country, index) => (
                    <option
                      value={country.phonecode}
                      key={country.phonecode || index}
                    >
                      {country.phonecode} &nbsp; {country.country_name}
                    </option>
                  ))}
                </InputSelect>
              </div>
              <div className="col-9 p-0">
                <Input
                  type="text"
                  id="cc_mobile_number"
                  className="form-control"
                  placeholder="Mobile number"
                  name="mobile_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile_number}
                  error={
                    formik.touched.mobile_number && formik.errors.mobile_number
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 p-0 btns-inline">
                <div className="btn-wrap">
                  <input
                    type="submit"
                    value="Validate Number"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    } ${formik.isValid ? "" : "opacity-75"}`}
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TopUp;
