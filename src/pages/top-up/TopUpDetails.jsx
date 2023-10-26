import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input from "components/ui/Input";
import Modal from "components/modals/Modal";
import InputSelect from "components/ui/InputSelect";
import { LoaderContext } from "context/loaderContext";
import AvatarInfo from "pages/profile/components/AvatarInfo";
import { useFormik } from "formik";
import { topUpDetailsSchema } from "schemas/fundSchema";
import WrapAmount from "components/wrapper/WrapAmount";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { getChargedAmount } from "helpers/commonHelpers";
import { useNavigate, useLocation } from "react-router-dom";
import TopUpFundedPopup from "components/popups/TopUpFundedPopup";
import { CURRENCY_SYMBOL } from "constants/all";

const TopUpDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerDetails = location.state?.customerDetails?.data;
  const {
    account_number = "",
    mobile_number = "",
    profile_image = "",
    user_name = "",
    national_id = "",
  } = customerDetails || {};
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [modalDetailsData, setModalDetailsData] = useState({});
  const [fundedDetails, setFundedDetails] = useState({ balance: "" });
  const [transferredAmount, setTransferredAmount] = useState("");
  const { setIsLoading } = useContext(LoaderContext);
  const { profile } = useSelector((state) => state.userProfile);
  const {
    system_commission_amount = "",
    system_commission_type = "",
    commission_amount = "",
    commission_type = "",
  } = profile || {};

  const [paymentTypeDetails, setPaymentTypeDetails] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    allCharges: [],
    totalCharges: 0.0,
    grandTotal: 0.0,
    total: 0.0,
  });

  const isCashPaymentType = () => {
    if (!selectedCard) return true; // If there's no selectedCard yet, default to treating it as 'cash'
    return selectedCard.collection_type.toLowerCase() === "cash";
  };

  // Sort paymentTypeDetails to prioritize 'cash'
  const sortedPaymentTypes = [...paymentTypeDetails].sort((a, b) => {
    if (a.collection_type.toLowerCase() === "cash") return -1;
    if (b.collection_type.toLowerCase() === "cash") return 1;
    return 0;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest.getAgentWiseCardList();

        // Handle the response data
        if (response?.data?.success) {
          setPaymentTypeDetails(response.data.data);
        } else {
          console.error(response?.data?.message || "Failed to fetch data.");
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the defined function
    fetchData();
  }, []); // Empty dependency array ensures this effect runs once when component mounts

  // After successfull payment done
  const handlePaymentCompleted = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getBalance();
      if (!data.success) throw data?.message;
      setFundedDetails({
        balance: data?.data?.available_balance || "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      receiver_account_number: account_number || "",
      transfer_amount: "",
      reference_id: "",
      commission_type_id: "",
      topup_type: selectedCard,
    },
    validationSchema: topUpDetailsSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      // Check if paymentDetails.total is negative
      // if (paymentDetails.total < 0) {
      //   toast.error("Amount should be greater than commission");
      //   return; // This will exit the function, preventing the rest of the code from running
      // }
      if (isCashPaymentType()) {
        values.reference_id = "";
      } else if (!values.reference_id) {
        // If payment type isn't "Cash" and reference_id is empty, set an error
        setErrors({
          reference_id: "Please enter reference id / transaction id",
        });
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await apiRequest.agentTopUps(values);
        if (!data.success) throw data.message;
        const { transfer_amount } = data.data;
        setTransferredAmount(transfer_amount);
        toast.success(data.message);
        resetForm();
        setModalDetailsData(values);
        handlePaymentCompleted();
        setShowTopUpModal(true);
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

  // useEffect(() => {
  //   if (selectedCard && formik.values.transfer_amount) {
  //     const enteredAmount = parseFloat(formik.values.transfer_amount);

  //     const charges = [
  //       {
  //         type: selectedCard.commission_type,
  //         amount: parseFloat(selectedCard.commission_amount),
  //         text: selectedCard.collection_type,
  //       },
  //     ];

  //     const { allCharges, totalCharges, grandTotal } = getChargedAmount(
  //       charges,
  //       [enteredAmount]
  //     );

  //     setPaymentDetails({
  //       ...paymentDetails,
  //       allCharges: allCharges,
  //       totalCharges: totalCharges,
  //       grandTotal: grandTotal,
  //       total: enteredAmount - totalCharges, // Compute the remaining amount after commission
  //     });
  //   }
  // }, [selectedCard, formik.values.transfer_amount]);

  useEffect(() => {
    if (selectedCard && formik.values.transfer_amount) {
      const enteredAmount = parseFloat(formik.values.transfer_amount);

      const charges = [
        {
          type: selectedCard.commission_type,
          amount: parseFloat(selectedCard.commission_amount || 0),
          text: selectedCard.collection_type,
        },
      ];

      // If system_commission_type and system_commission_amount exist, add them to charges
      if (system_commission_type && system_commission_amount) {
        charges.push({
          type: system_commission_type,
          amount: parseFloat(system_commission_amount || 0),
          text: "System Commission",
        });
      }

      // If commission_type and commission_amount exist, add them to charges
      if (commission_type && commission_amount) {
        charges.push({
          type: commission_type,
          amount: parseFloat(commission_amount || 0),
          text: "Additional Commission",
        });
      }

      const { allCharges, totalCharges, grandTotal } = getChargedAmount(
        charges,
        [enteredAmount]
      );

      setPaymentDetails({
        ...paymentDetails,
        allCharges: allCharges,
        totalCharges: totalCharges,
        grandTotal: grandTotal,
        total: enteredAmount - totalCharges,
      });
    }
  }, [
    selectedCard,
    formik.values.transfer_amount,
    system_commission_type,
    system_commission_amount,
    commission_type,
    commission_amount,
  ]);

  const handleCardDetailsChange = (event) => {
    formik.handleChange(event);
    const selectedValue = event.target.value;

    // Check if the selected value is a card id.
    const selectedCardId = parseInt(selectedValue, 10);
    const card = paymentTypeDetails.find((card) => card.id === selectedCardId);

    // If the card's collection_type is 'cash' (case-insensitive), set topup_type to 'cash'.
    // Otherwise, set it to 'card'.
    if (card && card.collection_type.toLowerCase() === "cash") {
      formik.setFieldValue("topup_type", "cash");
    } else {
      formik.setFieldValue("topup_type", "card");
    }

    setSelectedCard(card);
  };

  return (
    <div className="profile-inner-sec p-4">
      <div className="profile-left-content col-lg-7 col-12">
        <AvatarInfo
          profileImg={profile_image}
          profileName={user_name}
          profileNumber={mobile_number}
          nationalId={national_id}
        />
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-9 p-0 amt-with-currency">
                <span>{CURRENCY_SYMBOL}</span>
                <Input
                  id="transfer_amount"
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  name="transfer_amount"
                  maxLength="6"
                  placeholder="Amount"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.transfer_amount}
                  error={
                    formik.touched.transfer_amount &&
                    formik.errors.transfer_amount
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-9 p-0">
                <InputSelect
                  className="form-select form-control"
                  name="commission_type_id"
                  onChange={handleCardDetailsChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.commission_type_id}
                  error={
                    formik.touched.commission_type_id &&
                    formik.errors.commission_type_id
                  }
                >
                  <option value="">Payment Type</option>
                  {/* <option value="cash">Cash</option> */}
                  {sortedPaymentTypes.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.collection_type}
                    </option>
                  ))}
                </InputSelect>
              </div>
            </div>
            {!isCashPaymentType() && (
              <div className="row">
                <div className="col-9 p-0">
                  <Input
                    type="text"
                    inputMode="text"
                    id="reference_id"
                    className="form-control"
                    placeholder="Reference Id / Transaction Id"
                    name="reference_id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.reference_id}
                    error={
                      formik.touched.reference_id && formik.errors.reference_id
                    }
                  />
                </div>
              </div>
            )}
            <div className="row top-up-fund-row-amt top-up-fund-row-amt-final">
              <div className="col-9 p-0">
                <table>
                  <tbody>
                    <tr>
                      <td>Commission</td>
                      <td>
                        <WrapAmount value={paymentDetails.totalCharges} />
                      </td>
                    </tr>
                    <tr>
                      <td>Amount</td>
                      <td>
                        <WrapAmount value={paymentDetails.total} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pay-btn-wrap">
              <button
                type="button"
                onClick={() => navigate("/top-up")}
                className="btn btn-cancel-payment"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-send-payment"
                disabled={formik.isSubmitting}
              >
                Fund
              </button>
            </div>
          </form>
        </div>
        <Modal
          id="fund_sucess_modal"
          className="fund-sucess-modal"
          show={showTopUpModal}
        >
          <TopUpFundedPopup
            fund={paymentDetails.total}
            balance={transferredAmount}
            setShow={setShowTopUpModal}
            userName={user_name}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TopUpDetails;
