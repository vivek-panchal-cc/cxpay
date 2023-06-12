import React, { useEffect, useState } from "react";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { CHARGES_TYPE_PL, CURRENCY_SYMBOL } from "constants/all";
import Input from "components/ui/Input";
import { Link, useNavigate, useParams } from "react-router-dom";
import { withdrawCardSchema } from "schemas/walletSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { getChargedAmount } from "helpers/commonHelpers";
import useCharges from "hooks/useCharges";
import Modal from "components/modals/Modal";
import FundEffectPopup from "components/popups/FundEffectPopup";
import { useFormik } from "formik";

const WithdrawCard = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tid } = params || {};
  const [showModalRefunded, setShowModalRefunded] = useState(false);
  const [modalRefundedDetails, setModalRefundedDetails] = useState({
    amount: "",
    message: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });
  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_PL,
  });

  const formik = useFormik({
    initialValues: {
      specification: "",
      amount: "",
    },
    validationSchema: withdrawCardSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        const { data } = await apiRequest.initiateWithdrawRequest(values);
        if (!data.success) throw data.message;
        setModalRefundedDetails({
          amount: values.amount,
          message: "Refunded to Your Bank",
        });
        setShowModalRefunded(true);
      } catch (error) {
        console.log(error);
        if (typeof error === "string") return toast.error(error);
        const errorObj = {};
        for (const property in error) errorObj[property] = error[property]?.[0];
        setErrors(errorObj);
      }
    },
  });

  // For calculating fees, total, when entered amount changes
  useEffect(() => {
    const { amount } = formik.values || {};
    const parseAmount =
      amount?.trim() && !isNaN(amount) ? parseFloat(amount) : 0;
    const chargesDetails = getChargedAmount(charges, [parseAmount]);
    setPaymentDetails(chargesDetails);
  }, [formik.values.amount, charges]);

  if (!tid) navigate("/wallet/withdrawals-card", { replace: true });
  return (
    <div>
      <div className="settings-inner-sec wallet-ac-is wr-card-form-wrap">
        <div className="profile-info">
          <h3>Withdraw from card</h3>
          <Breadcrumb />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-12 col p-0">
                <div className="d-flex flex-column form-field">
                  <Input
                    type="text"
                    inputMode="text"
                    id="specification"
                    className="form-control"
                    placeholder="Sepecification"
                    name="specification"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.specification}
                    error={
                      formik.touched.specification &&
                      formik.errors.specification
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <p className="dark_blue font-16 font-600">
                Please enter amount to refund
              </p>
              <div className="col-12 p-0 amt-with-currency">
                <span>{CURRENCY_SYMBOL}</span>
                <div className="d-flex flex-column form-field">
                  <Input
                    type="text"
                    inputMode="decimal"
                    id="transactionAmount"
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
            </div>
            {/* <!-- payment blocks footer section starts --> */}
            <div className="row wbr-final-amt-wrap">
              <div className="col-12 p-0">
                <table>
                  <tbody>
                    {/* <tr>
                      <td>Total Amount</td>
                      <td className="amount">90.00</td>
                    </tr> */}
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <tr key={item?.desc?.trim() || index}>
                        <td>{item?.desc}</td>
                        <td className="amount">
                          {CURRENCY_SYMBOL} {item?.amount?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Net Payable</td>
                      <td>
                        {CURRENCY_SYMBOL}{" "}
                        {paymentDetails?.grandTotal?.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                <div className="btn-wrap">
                  <Link
                    to="/wallet/withdrawals-card"
                    className="btn outline-btn"
                    replace
                  >
                    Cancel
                  </Link>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    } ${formik.isValid ? "" : "opacity-75"}`}
                    disabled={formik.isSubmitting}
                    value="Submit Request"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal show={showModalRefunded} setShow={setShowModalRefunded}>
        <FundEffectPopup
          fund={modalRefundedDetails.amount}
          fundMessage={modalRefundedDetails.message}
          redirect="/wallet/withdrawals-bank"
        />
      </Modal>
    </div>
  );
};

export default WithdrawCard;
