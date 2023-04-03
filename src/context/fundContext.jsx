import Modal from "components/modals/Modal";
import AccountFundedPopup from "components/popups/AccountFundedPopup";
import { FUND_BANK, FUND_CARD, FUND_CASH } from "constants/all";
import { fetchBanksList, fetchCardsList } from "features/user/userWalletSlice";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { storageRequest } from "helpers/storageRequests";
import useCountriesCities from "hooks/useCountriesCities";
import SelectBank from "pages/fund-account/components/SelectBank";
import SelectCard from "pages/fund-account/components/SelectCard";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fundSchema } from "schemas/fundSchema";
import { LoaderContext } from "./loaderContext";

const initialValues = {
  email: "",
  country: "",
  country_index: -1, // not required for API
  country_iso: "", // not required for API
  city: "",
  transactionType: "PL",
  transactionAmount: "",
  chargedAmount: "0.00", // not required for API
};

const cardCreds = {
  card_id: "",
  card_number: "",
  expiry_full: "", // not required for API
  expiry_date: "", // mm/yyyy
  security_code: "",
  card_holder_first_name: "",
  card_holder_last_name: "",
  billing_address: "",
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

const getCountryCityCreds = (countryList, countryName, cityName) => {
  const i = countryList?.findIndex((e) => e.country_name === countryName);
  return {
    country_index: i,
    country_iso: countryList?.[i]?.iso,
    country: countryName,
    city: cityName,
  };
};

const FundProvider = ({ children }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { userProfile, userWallet } = useSelector((state) => state);
  const { setIsLoading } = useContext(LoaderContext);
  const [countryList, cityList] = useCountriesCities();
  //
  const [disbleCardField, setDisableCardField] = useState(false);
  const [disbleBankField, setDisableBankField] = useState(false);
  const [selectExistingCard, setSelectExistingCard] = useState(false);
  const [selectExistingBank, setSelectExistingBank] = useState(false);
  const [visiblePopupFunded, setVisiblePopupFunded] = useState(false);
  const [fundedDetails, setFundedDetails] = useState({ fund: "", balance: "" });
  const [chargesDetails, setChargesDetails] = useState({ fees: "0.00" });

  const { first_name, last_name, email, city, country } =
    userProfile.profile || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: fundSchema,
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        const [{ data: dataFund }, { data: dataBalance }] = await Promise.all([
          await apiRequest.addFund(values),
          await apiRequest.getBalance(),
        ]);
        if (!dataFund.success || !dataBalance.success)
          throw dataFund.success ? dataBalance.message : dataFund.message;
        toast.success(dataFund.message);
        setFundedDetails({
          fund: values.chargedAmount,
          balance: dataBalance?.data?.available_balance,
        });
        setVisiblePopupFunded(true);
        storageRequest.removeSignupCreds();
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

  // ---------------------- FOR CARD ----------------------------------------------------
  const attachDefaultCard = async () => {
    setIsLoading(true);
    await dispatch(fetchCardsList());
    setIsLoading(false);
  };

  const integrateCardDetails = (card) => {
    if (!card || Object.keys(card).length <= 0) return;
    const LocationCreds = getCountryCityCreds(
      countryList,
      card.country,
      card.city
    );
    const date = new Date();
    const moyr = card?.expiry_date?.split("/").map((item) => parseInt(item));
    date.setFullYear(moyr[1], moyr[0] - 1);
    const muValues = Object.assign(
      { ...formik.values },
      {
        ...LocationCreds,
        email: card.email,
        card_id: card.id,
        card_number: card.card_number,
        expiry_full: date,
        expiry_date: card.expiry_date,
        card_holder_first_name: card.card_holder_first_name,
        card_holder_last_name: card.card_holder_last_name,
        billing_address: card.billing_address,
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
    setIsLoading(true);
    await dispatch(fetchBanksList());
    setIsLoading(false);
  };

  const integrateBankDetails = (bank) => {
    if (!bank || Object.keys(bank).length <= 0) return;
    const LocationCreds = getCountryCityCreds(
      countryList,
      bank.country,
      bank.city
    );
    const muValues = Object.assign(
      { ...formik.values },
      {
        ...LocationCreds,
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
    const values = Object.assign({ ...bankCreds }, { ...initialValues });
    formik.setValues(values);
  };

  //   ---------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.getCharges();
        if (!data.success) throw data.message;
        setChargesDetails({ ...data.data, fees: "0.00" });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (
      !userProfile.profile ||
      Object.keys(userProfile.profile).length <= 0 ||
      countryList.length <= 0 ||
      !params.fundtype
    )
      return;
    const LocationCreds = getCountryCityCreds(countryList, country, city);
    const muValues = Object.assign(
      { ...initialValues },
      { ...LocationCreds, email }
    );
    switch (params.fundtype) {
      case FUND_CARD:
        const initValCard = Object.assign(
          { ...cardCreds },
          {
            ...muValues,
            card_holder_first_name: first_name,
            card_holder_last_name: last_name,
          }
        );
        formik.setValues(initValCard);
        attachDefaultCard();
        return;
      case FUND_CASH:
        return;
      case FUND_BANK:
        const initValBank = Object.assign(
          { ...bankCreds },
          {
            ...muValues,
            bank_holder_first_name: first_name,
            bank_holder_last_name: last_name,
          }
        );
        formik.setValues(initValBank);
        attachDefaultBank();
        return;
    }
  }, [userProfile.profile, countryList, params]);

  useEffect(() => {
    if (params.fundtype !== FUND_CARD || countryList.length <= 0) return;
    userWallet.defaultCard && integrateCardDetails(userWallet.defaultCard);
  }, [userWallet.defaultCard]);

  useEffect(() => {
    if (params.fundtype !== FUND_BANK || countryList.length <= 0) return;
    userWallet.defaultBank && integrateBankDetails(userWallet.defaultBank);
  }, [userWallet.defaultBank]);

  useEffect(() => {
    const amount = formik.values.transactionAmount
      ? parseFloat(formik.values.transactionAmount)
      : "";
    if (!formik.values.transactionAmount || !chargesDetails || isNaN(amount)) {
      setChargesDetails((cs) => ({ ...cs, fees: "0.00" }));
      formik.setFieldValue("chargedAmount", "0.00");
      return;
    }
    const percentage = parseFloat(chargesDetails.percentage);
    const fees = amount * (percentage / 100);
    const actualAmount = amount - fees;
    setChargesDetails((cs) => ({ ...cs, fees: fees.toFixed(2).toString() }));
    formik.setFieldValue("chargedAmount", actualAmount.toFixed(2).toString());
  }, [formik.values.transactionAmount]);

  useEffect(() => {
    if (!formik.values || !formik.values.account_type) return;
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

  return (
    <FundContext.Provider
      value={{
        formik,
        countryList,
        cityList,
        disbleCardField,
        disbleBankField,
        chargesDetails,
        integrateCardDetails,
        integrateBankDetails,
        handleSelectNewCard,
        handleSelectNewBank,
        handleSelectExistingCard,
        handleSelectExistingBank,
      }}
    >
      <Modal
        id="fund_sucess_modal"
        className="fund-sucess-modal"
        show={visiblePopupFunded}
      >
        <AccountFundedPopup {...fundedDetails} />
      </Modal>
      {params.fundtype === FUND_CARD ? (
        selectExistingCard ? (
          <SelectCard />
        ) : (
          children
        )
      ) : params.fundtype === FUND_BANK ? (
        selectExistingBank ? (
          <SelectBank />
        ) : (
          children
        )
      ) : (
        children
      )}
    </FundContext.Provider>
  );
};

export default FundProvider;
