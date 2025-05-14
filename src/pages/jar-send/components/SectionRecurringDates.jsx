import React, { useContext, useState } from "react";
import {
  CURRENCY_SYMBOL,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
} from "constants/all";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import { IconEdit } from "styles/svgs";
import WrapAmount from "components/wrapper/WrapAmount";
import { LoaderContext } from "context/loaderContext";
import ModalManualAddAmount from "components/modals/ModalManualAddAmount";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const SectionRecurringDates = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const [amountError, setAmountError] = useState("");
  const [items, setItems] = useState({});
  const [addAmountPopup, setAddAmountPopup] = useState(false);
  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  const disableComponent = isComponentDisabled(
    admin_approved,
    show_renew_section
  );
  const tableTr = {
    marginBottom: "25px",
  };

  const { details, setDetails, totalAmount } = props;
  const [occurrenceList, setOccurrenceList] = useState(
    (details || []).map((item, idx) => ({ ...item, id: item.id ?? idx + 1 }))
  );

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleModal = () => {
    setAddAmountPopup((am) => !am);
    setAmountError("");
  };

  // const handleSubmitAmount = ({ amount, recurring_date }) => {
  //   const updatedList = [...occurrenceList];
  //   if (items.index !== undefined) {
  //     updatedList[items.index] = {
  //       ...updatedList[items.index],
  //       amount,
  //       date: recurring_date,
  //     };
  //     setOccurrenceList(updatedList);
  //     setAddAmountPopup(false);
  //     setAmountError("");
  //   }
  //   if (setDetails) {
  //     setDetails(updatedList);
  //   }
  // };

  const handleSubmitAmount = async ({ amount, recurring_date }) => {
    const updatedList = [...occurrenceList];

    if (items.index !== undefined) {
      const updatedItem = {
        ...updatedList[items.index],
        amount,
        date: recurring_date,
      };

      updatedList[items.index] = updatedItem;

      // Build the occurrence list with local ids
      const occurrencePayload = updatedList.map((item, idx) => ({
        id: item.id ?? idx + 1,
        amount: parseFloat(item.amount).toFixed(2),
      }));

      const requestPayload = {
        // total_amount: occurrencePayload
        //   .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
        //   .toFixed(2),
        total_amount: totalAmount,
        changed_id: updatedItem.id ?? items.index + 1,
        occurrence: occurrencePayload,
      };

      try {
        setIsLoading(true);
        const { data } = await apiRequest.adjustSavingJarRecurringAmount(
          requestPayload
        );
        if (!data.success) throw data.message;
        const updatedFromAPI = data.data; // array of {id, amount}
        const newList = updatedList?.map((item) => {
          const matched = updatedFromAPI?.find((d) => d.id == item.id);
          return matched ? { ...item, amount: matched.amount } : item;
        });
        // toast.success(data.message);
        setOccurrenceList(newList);
        setDetails?.(newList);
        setAddAmountPopup(false);
        setAmountError("");
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap w-100">
        <div className="w-100-md rcr-transition-info rcr-transition-info-1">
          <table>
            <thead className="freq-date-header">
              <tr>
                <th>Freq. Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {occurrenceList?.length === 0 ? (
                <tr style={{ textAlign: "center", height: "300px" }}>
                  <td colSpan="3" className="border-0">
                    No data found
                  </td>
                </tr>
              ) : (
                occurrenceList?.map((dateEntry, index) => {
                  return (
                    <tr style={tableTr} key={index}>
                      <td className="text-black">
                        {formatDate(dateEntry.date)}
                      </td>
                      <td>
                        <div className={`act-amt-wrap cx-color-green p-0`}>
                          <WrapAmount
                            value={dateEntry.amount}
                            prefix={`${CURRENCY_SYMBOL} `}
                          />
                        </div>
                      </td>
                      <td className="border-0 pt-2 pb-2">
                        <div className="act-edit-btn">
                          <div className="d-flex jar-rec-buttons right-activity-div">
                            <button
                              className={`act-edit-wrap ${
                                adminApprovedWithRenewCheck
                                  ? ""
                                  : "contacts-admin-approved-disabled"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setItems({ ...dateEntry, index });
                                setAddAmountPopup(true);
                              }}
                              disabled={disableComponent}
                            >
                              <IconEdit style={{ stroke: "#FFF" }} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="payment-blocks-inner">
        <ModalManualAddAmount
          id="set-qr-amount"
          show={addAmountPopup}
          setShow={handleModal}
          heading="Enter Amount"
          subHeading=""
          handleCallback={handleSubmitAmount}
          error={""}
          allowClickOutSide={true}
          values={items}
          minAmount={totalAmount}
        />
      </div>
    </>
  );
};

export default SectionRecurringDates;
