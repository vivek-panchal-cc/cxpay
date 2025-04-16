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

  const { details, setDetails } = props;
  const [occurrenceList, setOccurrenceList] = useState(details || []);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleModal = () => {
    setAddAmountPopup((am) => !am);
    setAmountError("");
  };

  const handleSubmitAmount = (amount) => {
    const updatedList = [...occurrenceList];
    if (items.index !== undefined) {
      updatedList[items.index] = {
        ...updatedList[items.index],
        amount,
      };
      setOccurrenceList(updatedList);
      setAddAmountPopup(false);
      setAmountError("");
    }
    if (setDetails) {
      setDetails(updatedList);
    }
  };

  return (
    <>
      <div className="d-flex flex-wrap w-100">
        <div className="w-100-md rcr-transition-info rcr-transition-info-1">
          <table>
            <thead className="freq-date-header">
              <tr>
                <th>Frequency Date</th>
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
        />
      </div>
    </>
  );
};

export default SectionRecurringDates;
