import React, { useEffect, useState, useContext } from "react";
import { useFormik } from "formik";
import { IconAddBackground, IconBank, IconRightArrowBig } from "styles/svgs";
import { fetchBanksList } from "features/user/userWalletSlice";
import { LoaderContext } from "context/loaderContext";
import { useDispatch, useSelector } from "react-redux";
import { CHARGES_TYPE_WD, CURRENCY_SYMBOL } from "constants/all";
import { dateFormattor, getChargedAmount } from "helpers/commonHelpers";
import { withdrawBankSchema } from "schemas/walletSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import InputRadioType from "components/ui/InputRadioType";
import InputSelect from "components/ui/InputSelect";
import Input from "components/ui/Input";
import Modal from "components/modals/Modal";
import FundEffectPopup from "components/popups/FundEffectPopup";
import SelectLinkedBank from "./components/SelectLinkedBank";
import useCountryBanks from "hooks/useCountryBanks";
import useCharges from "hooks/useCharges";
import WrapAmount from "components/wrapper/WrapAmount";
import useAvailableCardBalance from "hooks/useAvailableCardBalance";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { SystemOptionsContext } from "context/systemOptionsContext";
import { LoginContext } from "context/loginContext";

const WithdrawBank = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { defaultBank } = useSelector((state) => state.userWallet);
  const { SUPPORT_EMAIL } = useContext(SystemOptionsContext);
  const { setIsLoading } = useContext(LoaderContext);
  const [addNewBank, setAddNewBank] = useState(false);
  const [selectExistingBank, setSelectExistingBank] = useState(false);
  const [disbleBankField, setDisableBankField] = useState(false);
  const [showModalRefunded, setShowModalRefunded] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [modalRefundedDetails, setModalRefundedDetails] = useState({
    amount: "",
    message: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });
  const { profile } = useSelector((state) => state.userProfile);
  const { admin_approved } = profile || {};
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const [banksList] = useCountryBanks();
  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_WD,
  });
  const [loadingCardBalance, { remaining_amount, bank_withdraw }] =
    useAvailableCardBalance();

  const formik = useFormik({
    initialValues: {
      bank_id: "",
      bank_account_number: "",
      bank_name: "",
      // swift_code: "",
      account_type: "savings",
      amount: "",
      specification: "",
      user_date_time: "", // date time string
      save_bank: false,
    },
    validationSchema: withdrawBankSchema,
    onSubmit: async (values, { setErrors }) => {
      if (parseFloat(paymentDetails.total.toFixed(2)) <= 0) return;
      setShowWithdrawConfirm(true);
    },
  });

  const handleBankWithdraw = async () => {
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
      const { data } = await apiRequest.initiateWithdrawRequest(values);
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

  // For handling selecting bank account from the linked banks list
  const handleSelectExistingBank = async (selectedBank) => {
    const {
      id,
      account_type,
      bank_name,
      // swift_code,
      bank_number,
      country_bank_id,
    } = selectedBank || {};
    await formik.setFieldValue("bank_id", id);
    await formik.setFieldValue("bank_account_number", bank_number);
    await formik.setFieldValue("bank_name", country_bank_id);
    // await formik.setFieldValue("swift_code", swift_code);
    await formik.setFieldValue("account_type", account_type);
    setSelectExistingBank(false);
    if (!id) return handleLinkNewBank();
    setAddNewBank(false);
    setDisableBankField(true);
  };

  // For handling link a new bank account
  const handleLinkNewBank = async () => {
    setDisableBankField(false);
    await formik.setFieldValue("bank_id", "");
    await formik.setFieldValue("bank_account_number", "");
    await formik.setFieldValue("bank_name", "");
    // await formik.setFieldValue("swift_code", "");
    await formik.setFieldValue("account_type", "savings");
    setAddNewBank(true);
  };

  // For fetching the liked bank accounts in the redux state
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await dispatch(fetchBanksList());
      setIsLoading(false);
    })();
  }, []);

  // For redirection to card withdraw list when bank_withdraw is disabled
  useEffect(() => {
    if (!loadingCardBalance && bank_withdraw === false && remaining_amount > 5)
      navigate("/wallet/withdrawals-card");
  }, [loadingCardBalance, remaining_amount, bank_withdraw]);

  // For default primary bank selection
  useEffect(() => {
    if (!defaultBank) return;
    handleSelectExistingBank(defaultBank);
  }, [defaultBank]);

  // For calculating fees, total, when entered amount changes
  useEffect(() => {
    const { amount } = formik.values || {};
    const parseAmount =
      amount?.trim() && !isNaN(amount) ? parseFloat(amount) : 0;
    const chargesDetails = getChargedAmount(charges, [parseAmount]);
    chargesDetails.total = chargesDetails.total - chargesDetails.totalCharges;
    setPaymentDetails(chargesDetails);
  }, [formik.values.amount, charges]);

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  return (
    <>
      {selectExistingBank ? (
        <SelectLinkedBank
          selectedBankId={formik.values.bank_id}
          onCancel={() => setSelectExistingBank(false)}
          onProceed={handleSelectExistingBank}
        />
      ) : (
        <div className="settings-inner-sec wallet-ac-is wr-form-wrap">
          <div className="profile-info">
            <h3>Bank Withdraw</h3>
            <Breadcrumb className="mt-2" />
          </div>
          <div className="wallet-fund-form-wrap">
            <form onSubmit={formik.handleSubmit}>
              <InputRadioType
                name="account_type"
                valueSelected={formik.values.account_type}
                valueTypeOne="savings"
                valueTypeTwo="current"
                handleChange={formik.handleChange}
                disabled={disbleBankField}
              />
              <div className="row">
                <div className="col-12 col p-0">
                  <InputSelect
                    className="form-select form-control"
                    name="bank_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bank_name}
                    error={formik.touched.bank_name && formik.errors.bank_name}
                    disabled={disbleBankField}
                  >
                    <option value={""}>Select Bank</option>
                    {banksList?.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.bank_name}
                      </option>
                    ))}
                  </InputSelect>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 col-left p-0">
                  <div className="d-flex flex-column">
                    <Input
                      type="text"
                      inputMode="numeric"
                      className="form-control"
                      placeholder="Bank account number"
                      name="bank_account_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.bank_account_number}
                      disabled={disbleBankField}
                      error={
                        formik.touched.bank_account_number &&
                        formik.errors.bank_account_number
                      }
                    />
                  </div>
                </div>
                {/* <div className="col-lg-6 col-12 col-right p-0">
                  <div className="d-flex flex-column">
                    <Input
                      type="text-uppercase"
                      inputMode="text"
                      className="form-control"
                      placeholder="Swift Code"
                      name="swift_code"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.swift_code}
                      disabled={disbleBankField}
                      error={
                        formik.touched.swift_code && formik.errors.swift_code
                      }
                    />
                  </div>
                </div> */}
              </div>
              <div className="row">
                <div className="col-12 p-0">
                  {addNewBank ? (
                    <div className="form-field wallet-cb-wrap">
                      <input
                        type="checkbox"
                        id="save_bank_acc_w"
                        name="save_bank"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.save_bank && formik.errors.save_bank
                        }
                      />
                      <label htmlFor="save_bank_acc_w">Save Bank Account</label>
                    </div>
                  ) : (
                    <div className="form-field">
                      <a
                        onClick={handleLinkNewBank}
                        className="form-add-cwrap cursor-pointer"
                      >
                        <IconAddBackground style={{ fill: "#24BEEF" }} />
                        <span>Link New Bank Account</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="row wr-form-choose-act">
                <div className="col-12 p-0">
                  <div className="form-field cursor-pointer">
                    <a
                      onClick={() => setSelectExistingBank(true)}
                      className="form-choose-act-wrap"
                    >
                      <IconBank stroke="#363853" />
                      <span>Choose from Linked Banks</span>
                      <IconRightArrowBig stroke="#0081C5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col p-0">
                  <div className="d-flex flex-column form-field">
                    <Input
                      type="text"
                      name="specification"
                      className="form-control"
                      placeholder="Payment specifications"
                      inputMode="text"
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
                <div className="col-12 p-0 amt-with-currency">
                  <span>{CURRENCY_SYMBOL}</span>
                  <Input
                    type="text"
                    id="amount"
                    name="amount"
                    placeholder="Amount"
                    inputMode="decimal"
                    className="form-control"
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
              <div>
                It will takes 2 to 4 working days to complete this transaction.
                For any query, drop an email on{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </div>
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
                          <WrapAmount
                            value={Math.max(paymentDetails?.total, 0)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td></td>
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
              {admin_approved &&
              show_renew_section !== "disable_fund_action" ? (
                <div className="row">
                  <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                    <div className="btn-wrap">
                      <Link
                        to="/wallet/withdrawals-bank"
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
                        disabled={
                          formik.isSubmitting ||
                          parseFloat(paymentDetails.total.toFixed(2)) <= 0
                        }
                        value="Submit Request"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      )}
      <Modal show={showModalRefunded} setShow={setShowModalRefunded}>
        <FundEffectPopup
          fund={modalRefundedDetails.amount}
          fundMessage={modalRefundedDetails.message}
          redirect="/wallet/withdrawals-bank"
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
        handleCallback={handleBankWithdraw}
      />
    </>
  );
};

export default WithdrawBank;
