import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import UploadFile from "components/upload-files/UploadFile";
import { useFormik } from "formik";
import { fundCashCreditSchema } from "schemas/fundSchema";
import { getChargedAmount } from "helpers/commonHelpers";
import useCharges from "hooks/useCharges";
import { CHARGES_TYPE_MF } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import BankDetailsSection from "./BankDetailsSection";

const FundCashCredit = (props) => {
  const { setIsLoading } = useContext(LoaderContext);

  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_MF,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
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
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.initiateManualFundAdd(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        // setVisiblePopupFunded(true);
        // storageRequest.removeSignupCreds();
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
          <ul className="breadcrumb">
            <li>
              <a href="#">Wallet</a>
            </li>
            <li>Fund Account</li>
          </ul>
        </div>
        <div className="wallet-fund-form-wrap">
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
                  onBlur={formik.handleBlur}
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
              name="receipt"
              files={formik.values.receipt}
              onChange={async (files) =>
                await formik.setFieldValue("receipt", files)
              }
              showPreview={true}
              max={3}
              error={formik.touched.receipt && formik.errors.receipt}
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
                        <WrapAmount value={paymentDetails?.total} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row">
              <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                <div className="btn-wrap">
                  <a href="#" className="btn outline-btn">
                    Cancel
                  </a>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    value="Fund"
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
};

export default FundCashCredit;
