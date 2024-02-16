import React, { useContext, useEffect, useMemo, useState } from "react";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { CHARGES_TYPE_WD, CURRENCY_SYMBOL } from "constants/all";
import Input from "components/ui/Input";
import { useNavigate, useParams } from "react-router-dom";
import { withdrawCardSchema } from "schemas/walletSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { dateFormattor, getChargedAmount } from "helpers/commonHelpers";
import useCharges from "hooks/useCharges";
import Modal from "components/modals/Modal";
import FundEffectPopup from "components/popups/FundEffectPopup";
import { useFormik } from "formik";
import useWithdrawDetails from "hooks/useWithdrawDetails";
import WrapAmount from "components/wrapper/WrapAmount";
import Button from "components/ui/Button";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoaderContext } from "context/loaderContext";
import { SystemOptionsContext } from "context/systemOptionsContext";

const WithdrawCard = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tid } = params || {};
  const { SUPPORT_EMAIL } = useContext(SystemOptionsContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [showModalRefunded, setShowModalRefunded] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [modalRefundedDetails, setModalRefundedDetails] = useState({
    amount: "",
    message: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    totalCharges: 0.0,
    total: 0.0,
  });
  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_WD,
  });
  const [loadingDetails, details] = useWithdrawDetails({
    transaction_id: tid,
    withdrawType: "card",
  });

  const {
    card_number = "",
    card_expiry_date = "",
    transaction_id = "",
    remaining_amount = "",
  } = useMemo(() => ({ ...details }), [details]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      card_number: card_number,
      card_expiry_date: card_expiry_date,
      transaction_id: transaction_id,
      txn_source: "CARD",
      user_date_time: "",
      specification: "",
      amount: "",
    },
    validationSchema: withdrawCardSchema,
    onSubmit: async (values, { setErrors }) => {
      if(parseFloat(paymentDetails.total.toFixed(2)) <= 0) return;
      setShowWithdrawConfirm(true);
    },
  });

  const handleCardWithdraw = async () => {
    const values = formik.values || {};
    const validateObj = await formik.validateForm(values);
    setShowWithdrawConfirm(false);
    if (Object.keys(validateObj).length > 0) {
      formik.setTouched(validateObj);
      formik.setErrors(validateObj);
      return;
    }
    setIsLoading(true);
    try {
      values.user_date_time = dateFormattor(new Date());
      const { data } = await apiRequest.initiateCardWithdraw(values);
      if (!data.success) throw data.message;
      setModalRefundedDetails({
        amount: data?.data?.amount,
        message: data?.message,
      });
      setShowModalRefunded(true);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") return toast.error(error);
      const errorObj = {};
      for (const property in error) errorObj[property] = error[property]?.[0];
      formik.setErrors(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  // For calculating fees, total, when entered amount changes
  useEffect(() => {
    const { amount } = formik.values || {};
    const parseAmount =
      amount?.trim() && !isNaN(amount) ? parseFloat(amount) : 0;
    const chargesDetails = getChargedAmount(charges, [parseAmount]);
    chargesDetails.total = chargesDetails.total - chargesDetails.totalCharges;
    setPaymentDetails(chargesDetails);
  }, [formik.values.amount, charges]);

  if (!tid) navigate("/wallet/withdrawals-card", { replace: true });
  return (
    <div>
      <div className="settings-inner-sec wallet-ac-is wr-card-form-wrap">
        <div className="profile-info">
          <h3>Card Withdraw</h3>
          <Breadcrumb className="mt-2" skipIndexes={[2]} />
        </div>
        <div className="row wr-form-choose-act mb-4">
          <div className="col-12 p-0">
            <div className="form-field cursor-pointer">
              <p className="form-choose-act-wrap px-5">
                <span>
                  You are eligible for a withdrawal of{" "}
                  <b>
                    <WrapAmount value={remaining_amount} />
                  </b>{" "}
                  for card
                </span>
              </p>
            </div>
          </div>
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
                </div>
              </div>
            </div>
            <div className="row">
              {/* <p className="dark_blue font-16 font-600">
                Please enter amount to refund
              </p> */}
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
            <div>
              It will takes 2 to 4 working days to complete this transaction.
              For any query, drop a mail on{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
            {/* <!-- payment blocks footer section starts --> */}
            <div className="row wbr-final-amt-wrap">
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
                      <td>Total Amount</td>
                      <td>
                        {/* <WrapAmount value={paymentDetails?.total} /> */}
                        <WrapAmount value={Math.max(paymentDetails?.total, 0)} />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        {/* <WrapAmount value={paymentDetails?.total} /> */}
                        <WrapAmount value={Math.max(paymentDetails?.total, 0)} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    } ${formik.isValid ? "" : "opacity-75"}`}
                    disabled={formik.isSubmitting || parseFloat(paymentDetails.total.toFixed(2)) <= 0}
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
          redirect="/wallet/withdrawals-card"
        />
      </Modal>
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showWithdrawConfirm}
        setShow={setShowWithdrawConfirm}
        heading={"Are you sure want to withdraw amount?"}
        subHeading={
          "Once it's initiated, your requested amount will be reserved until the transaction completes."
        }
        handleCallback={handleCardWithdraw}
      />
    </div>
  );
};

export default WithdrawCard;
