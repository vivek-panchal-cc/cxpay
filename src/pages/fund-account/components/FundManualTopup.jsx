import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import UploadFile from "components/upload-files/UploadFile";
import { useFormik } from "formik";
import { fundCashCreditSchema } from "schemas/fundSchema";
import { addObjToFormData, getChargedAmount } from "helpers/commonHelpers";
import useCharges from "hooks/useCharges";
import {
  CHARGES_TYPE_MF,
  CURRENCY_SYMBOL,
  FILE_SIZE,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import BankDetailsSection from "./BankDetailsSection";
import Button from "components/ui/Button";
import { useNavigate } from "react-router";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import ModalAlert from "components/modals/ModalAlert";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

const FundManualTopup = (props) => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { profile } = useSelector((state) => state.userProfile);
  const { admin_approved } = profile || {};
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
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
      if (parseFloat(paymentDetails.total.toFixed(2)) <= 0) return;
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
    navigate(-1);
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
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Fund your account</h3>
          <Breadcrumb skipIndexes={[1]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-12 p-0">
                <div className="form-field">
                  <p className="text-dark mb-2">
                    Bank Details to Deposit amount
                  </p>
                  <BankDetailsSection />
                </div>
              </div>
            </div>
            <div className="row">
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
              error={formik.touched.receipt && formik.errors.receipt}
              onChange={async (files) =>
                await formik.setFieldValue("receipt", files)
              }
            />

            <div className="row wallet-fund-row-amt wallet-fund-row-amt-final">
              <div className="col-12 p-0">
                <table>
                  <tbody>
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <tr key={item?.desc?.trim() || index}>
                        <td>{item?.desc}</td>
                        <td className="amount">
                          <WrapAmount value={item?.amount} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Net Payable</td>
                      <td>
                        {/* <WrapAmount value={paymentDetails?.total} /> */}
                        <WrapAmount
                          value={Math.max(paymentDetails?.total, 0)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {adminApprovedWithRenewCheck ? (
              <div className="row">
                <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                  <div className="btn-wrap">
                    <Button
                      className="btn outline-btn"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="btn-wrap">
                    <input
                      type="submit"
                      value="Fund"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      } ${formik.isValid ? "" : "opacity-75"}`}
                      disabled={
                        formik.isSubmitting ||
                        parseFloat(paymentDetails.total.toFixed(2)) <= 0
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
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

export default FundManualTopup;
