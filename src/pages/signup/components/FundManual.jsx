import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import UploadFile from "components/upload-files/UploadFile";
import { CHARGES_TYPE_MF, CURRENCY_SYMBOL, FILE_SIZE } from "constants/all";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { addObjToFormData, getChargedAmount } from "helpers/commonHelpers";
import useCharges from "hooks/useCharges";
import BankDetailsSection from "pages/fund-account/components/BankDetailsSection";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fundCashCreditSchema } from "schemas/fundSchema";
import { LoaderContext } from "context/loaderContext";
import WrapAmount from "components/wrapper/WrapAmount";
import ModalAlert from "components/modals/ModalAlert";

const FundManual = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_MF,
  });
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

  const formik = useFormik({
    initialValues: {
      amount: "",
      specification: "",
      fees: "",
      receipt: [],
    },
    validationSchema: fundCashCreditSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        const muValues = { ...values };
        muValues.fees = paymentDetails.totalCharges;
        const formData = new FormData();
        for (const key in muValues)
          addObjToFormData(muValues[key], key, formData);
        for (const file of values.receipt) formData.append("receipt[]", file);
        const { data } = await apiRequest.initiateManualFundAdd(formData);
        if (!data.success) throw data.message;
        resetForm();
        setModalDetails({ show: true, message: data?.message || "" });
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

  const handleModalCallback = () => {
    setModalDetails({ show: false, message: "" });
    navigate("/");
  };

  // For calculating charges when amount changes for any contact
  useEffect(() => {
    const { amount } = formik.values || {};
    const parseAmount =
      amount?.trim() && !isNaN(amount) ? parseFloat(amount) : 0;
    const chargesDetails = getChargedAmount(charges, [parseAmount]);
    chargesDetails.total = chargesDetails.total - chargesDetails.totalCharges;
    setPaymentDetails(chargesDetails);
  }, [formik.values?.amount, charges]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-12 p-0">
            <div className="form-field">
              <BankDetailsSection />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-0">
            <Input
              type="text"
              inputMode="decimal"
              id="cc_amount"
              className="form-control"
              placeholder="Amount"
              name="amount"
              maxLength="10"
              onChange={formik.handleChange}
              onBlur={(e) => {
                let value = e.target.value.trim();
                // If the input value is empty, set it to '0.00'
                if (!value) {
                  value = "0.00";
                } else {
                  const hasDecimal = value.includes(".");
                  // If there's no decimal point, add .00
                  if (!hasDecimal) {
                    value += ".00";
                  } else {
                    // If there's only one digit after the decimal point, add another zero
                    const parts = value.split(".");
                    if (parts[1].length === 1) {
                      value += "0";
                    }
                  }
                }
                // Update the formik values with the formatted value
                formik.setFieldValue("amount", value);
                formik.handleBlur(e);
              }}
              value={formik.values.amount}
              error={formik.touched.amount && formik.errors.amount}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-0">
            <Input
              type="text"
              id="cc_specification"
              className="form-control"
              placeholder="Specification"
              name="specification"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.specification}
              error={
                formik.touched.specification && formik.errors.specification
              }
            />
          </div>
        </div>
        <UploadFile
          max={3}
          maxSize={FILE_SIZE}
          name="receipt"
          showPreview={true}
          files={formik.values.receipt}
          onChange={async (files) =>
            await formik.setFieldValue("receipt", files)
          }
          error={formik.touched.receipt && formik.errors.receipt}
        />
        <div className="payment-footer-block p-4">
          <ul>
            {paymentDetails?.allCharges?.map((item, index) => (
              <li key={item?.desc?.trim() || index}>
                <div className="payment-footer-col-label">{item?.desc}</div>
                <h4 className="amount d-flex justify-content-between">
                  <span>{CURRENCY_SYMBOL}</span>
                  <WrapAmount value={item?.amount} prefix="" />
                </h4>
              </li>
            ))}
            <li>
              <div className="payment-footer-col-label">Net Payable</div>
              <h4 className="amount d-flex justify-content-between">
                <span>{CURRENCY_SYMBOL}</span>
                <WrapAmount value={paymentDetails?.grandTotal} prefix="" />
              </h4>
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
            <div className="btn-wrap">
              <input
                type="submit"
                className={`btn btn-primary ${
                  formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                } ${formik.isValid ? "" : "opacity-75"}`}
                disabled={formik.isSubmitting}
                value="Fund"
              />
            </div>
            <div className="btn-wrap">
              <Link to={"/"} className="btn outline-btn" replace={true}>
                {"Skip >>"}
              </Link>
            </div>
          </div>
        </div>
      </form>
      <ModalAlert
        id="manual_fund_initiated"
        className="fund-sucess-modal"
        show={modalDetails?.show}
        heading={modalDetails?.message}
        headingImg={"/assets/images/fund-success-tick.svg"}
        btnText={"Done"}
        handleBtnClick={handleModalCallback}
      />
    </>
  );
};

export default FundManual;
