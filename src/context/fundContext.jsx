import React, { useContext, useEffect, useMemo, useState } from "react";
import AccountFundedPopup from "components/popups/AccountFundedPopup";
import Modal from "components/modals/Modal";
import { CHARGES_TYPE_PL, FUND_BANK, FUND_CARD } from "constants/all";
import { fetchBanksList, fetchCardsList } from "features/user/userWalletSlice";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import useCountriesCities from "hooks/useCountriesCities";
import SelectBank from "pages/fund-account/components/SelectBank";
import SelectCard from "pages/fund-account/components/SelectCard";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fundSchema } from "schemas/fundSchema";
import { LoaderContext } from "./loaderContext";
import useCountryBanks from "hooks/useCountryBanks";
import { getChargedAmount } from "helpers/commonHelpers";
import { fetchAddFundWithCard } from "features/payment/payAddFundSlice";
import ModalPaymentAddFund from "components/modals/ModalPaymentAddFund";
import useCharges from "hooks/useCharges";

const initialValues = {
  // email: "",
  // country: "",
  // city: "",
  // transactionType: "PL",
  transactionAmount: "",
  chargedAmount: "0.00", // not required for API
};

const cardCreds = {
  card_id: "",
  card_number: "",
  expiry_full: "", // not required for API
  expiry_date: "", // mm/yyyy
  security_code: "",
  save_card: false,
  txn_mode: "CARD",
};

const bankCreds = {
  bank_id: "",
  account_type: "current",
  bank_name: "",
  routing_number: "",
  bank_account_number: "",
  bank_holder_first_name: "",
  bank_holder_last_name: "",
  address: "",
  save_bank: false,
  txn_mode: "BANK",
};

export const FundContext = React.createContext({});

const FundProvider = ({ children }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const { userProfile, userWallet, payAddFund } = useSelector((state) => state);
  const { loadingPayment = false, paymentStatus = "" } = payAddFund || {};
  const [loadingCharges, charges] = useCharges({
    chargesType: CHARGES_TYPE_PL,
  });
  const [countryList, cityList] = useCountriesCities();
  const [banksList] = useCountryBanks();

  const [disbleCardField, setDisableCardField] = useState(false);
  const [disbleBankField, setDisableBankField] = useState(false);
  const [selectExistingCard, setSelectExistingCard] = useState(false);
  const [selectExistingBank, setSelectExistingBank] = useState(false);
  const [visiblePopupFunded, setVisiblePopupFunded] = useState(false);
  const [fundedDetails, setFundedDetails] = useState({ fund: "", balance: "" });
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    grandTotal: 0.0,
    total: 0.0,
  });

  const { first_name, last_name, email, city, country, address } =
    userProfile.profile || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues,
      ...(params.fundtype === FUND_CARD ? cardCreds : {}),
      ...(params.fundtype === FUND_BANK ? bankCreds : {}),
    },
    validationSchema: fundSchema,
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      try {
        switch (params.fundtype) {
          case FUND_CARD:
            const { error, payload } = await dispatch(
              fetchAddFundWithCard(values)
            );
            if (error) throw payload;
            break;
          case FUND_BANK:
            return;
          default:
            return;
        }
        storageRequest.removeSignupCreds();
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        const errorObj = {};
        for (const property in error) errorObj[property] = error[property]?.[0];
        setErrors(errorObj);
      }
    },
  });

  // ---------------------- FOR CARD ----------------------------------------------------
  const attachDefaultCard = async () => {
    await dispatch(fetchCardsList());
    setIsLoading(false);
  };

  const integrateCardDetails = (card) => {
    if (!card || Object.keys(card).length <= 0) return;
    const date = new Date();
    const moyr = card?.expiry_date?.split("/").map((item) => parseInt(item));
    date.setFullYear(moyr[1], moyr[0] - 1);
    const muValues = Object.assign(
      { ...formik.values },
      {
        card_id: card.id,
        card_number: card.card_number,
        expiry_full: date,
        expiry_date: card.expiry_date,
        security_code: "",
      }
    );
    formik.setValues(muValues);
    setDisableCardField(true);
  };

  const handleSelectExistingCard = (bool) => {
    setSelectExistingCard(bool);
  };

  const handleSelectNewCard = () => {
    setDisableCardField(false);
    const values = Object.assign({ ...cardCreds }, { ...initialValues });
    formik.setValues(values);
  };

  // ---------------------- FOR BANK ----------------------------------------------------
  const attachDefaultBank = async () => {
    await dispatch(fetchBanksList());
    setIsLoading(false);
  };

  const integrateBankDetails = (bank) => {
    if (!bank || Object.keys(bank).length <= 0) return;
    const muValues = Object.assign(
      { ...formik.values },
      {
        country: bank.country,
        city: bank.city,
        email: bank.email,
        bank_id: bank.id,
        account_type: bank.account_type,
        bank_name: bank.bank_name,
        routing_number: bank.routing_number,
        bank_account_number: bank.bank_number,
        bank_holder_first_name: bank.bank_holder_first_name,
        bank_holder_last_name: bank.bank_holder_last_name,
        address: bank.address,
      }
    );
    formik.setValues(muValues);
    setDisableBankField(true);
  };

  const handleSelectExistingBank = (bool) => {
    setSelectExistingBank(bool);
  };

  const handleSelectNewBank = () => {
    setDisableBankField(false);
    const muValues = Object.assign(
      { ...initialValues },
      {
        country,
        city,
        email,
        bank_holder_first_name: first_name,
        bank_holder_last_name: last_name,
        address: address,
      }
    );
    const values = Object.assign({ ...bankCreds }, { ...muValues });
    formik.setValues(values);
  };

  //   ---------------------------------------------------------------------------------------------------------------

  // On successfull payment done
  const handlePaymentCompleted = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getBalance();
      if (!data.success) throw data?.message;
      setFundedDetails({
        fund: paymentDetails.total || "",
        balance: data?.data?.available_balance || "",
      });
      setVisiblePopupFunded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      !userProfile.profile ||
      Object.keys(userProfile.profile).length <= 0 ||
      !params.fundtype
    )
      return;
    const muValues = Object.assign(
      { ...initialValues },
      { country, city, email }
    );
    setIsLoading(true);
    switch (params.fundtype) {
      case FUND_CARD:
        formik.setValues({ ...cardCreds, ...initialValues });
        attachDefaultCard();
        return;
      case FUND_BANK:
        const initValBank = Object.assign(
          { ...bankCreds },
          {
            ...muValues,
            bank_holder_first_name: first_name,
            bank_holder_last_name: last_name,
            address: address,
          }
        );
        formik.setValues(initValBank);
        attachDefaultBank();
        return;
      default:
        return;
    }
  }, [userProfile.profile, params]);

  useEffect(() => {
    if (params.fundtype !== FUND_CARD || countryList.length <= 0) return;
    userWallet.defaultCard && integrateCardDetails(userWallet.defaultCard);
  }, [userWallet.defaultCard]);

  useEffect(() => {
    if (params.fundtype !== FUND_BANK || countryList.length <= 0) return;
    userWallet.defaultBank && integrateBankDetails(userWallet.defaultBank);
  }, [userWallet.defaultBank]);

  // For calculating charges when amount changes for any contact
  useEffect(() => {
    const { transactionAmount } = formik.values || {};
    const amount =
      transactionAmount?.trim() && !isNaN(transactionAmount)
        ? parseFloat(transactionAmount)
        : 0;
    const chargesDetails = getChargedAmount(charges, [amount]);
    setPaymentDetails(chargesDetails);
  }, [formik.values?.transactionAmount, charges]);

  // For Bank Account-Type changes
  useEffect(() => {
    const { account_type } = formik?.values || {};
    if (!account_type) return;
    if (formik.values.bank_id) return;
    (async () => {
      const values = Object.assign(
        { ...formik.values },
        {
          account_type: formik.values.account_type,
          bank_name: "",
          routing_number: "",
          bank_account_number: "",
          address: "",
        }
      );
      const errors = Object.assign(
        { ...formik.errors },
        {
          bank_name: "",
          routing_number: "",
          bank_account_number: "",
          address: "",
        }
      );
      await formik.setValues(values);
      await formik.setErrors(errors);
    })();
  }, [formik.values.account_type]);

  const fundDetails = useMemo(
    () => ({
      // countryList,
      // cityList,
      // banksList,
      // disbleBankField,
      // integrateBankDetails,
      // handleSelectNewBank,
      // handleSelectExistingBank,
      formik,
      disbleCardField,
      paymentDetails,
      integrateCardDetails,
      handleSelectNewCard,
      handleSelectExistingCard,
    }),
    [
      formik,
      disbleCardField,
      paymentDetails,
      integrateCardDetails,
      handleSelectNewCard,
      handleSelectExistingCard,
    ]
  );

  return (
    <FundContext.Provider value={fundDetails}>
      <ModalPaymentAddFund
        id="fund_payment_modal"
        onFundCompleted={handlePaymentCompleted}
      />
      <Modal
        id="fund_sucess_modal"
        className="fund-sucess-modal"
        show={visiblePopupFunded && fundedDetails.balance && fundedDetails.fund}
      >
        <AccountFundedPopup
          {...fundedDetails}
          setShow={setVisiblePopupFunded}
        />
      </Modal>
      {params.fundtype === FUND_CARD &&
        (selectExistingCard ? <SelectCard /> : children)}
      {params.fundtype === FUND_BANK &&
        (selectExistingBank ? <SelectBank /> : children)}
      {params.fundtype !== FUND_CARD && children}
    </FundContext.Provider>
  );
};

export default FundProvider;
