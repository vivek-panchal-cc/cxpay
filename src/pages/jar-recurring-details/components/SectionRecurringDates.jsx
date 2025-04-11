import React, { useContext, useState } from "react";
import LoaderDiv from "loaders/LoaderDiv";
import {
  CURRENCY_SYMBOL,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
  recurringTypeStatus,
} from "constants/all";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import { IconBin, IconEdit } from "styles/svgs";
import ModalAddAmount from "components/modals/ModalAddAmount";
import ModalConfirmation from "components/modals/ModalConfirmation";
import WrapAmount from "components/wrapper/WrapAmount";

const SectionRecurringDates = (props) => {
  const [addAmountPopup, setAddAmountPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
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
  const isLoading = props?.loading;
  const tableTr = {
    marginBottom: "25px",
  };

  const { recurring_dates = [] } = props?.details || {};

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmitAmount = () => {
    console.log("Hello");
    setAddAmountPopup(false);
  };

  const handleCallbackTransaction = () => {
    console.log("HelloDel");
    setShowDeletePopup(false);
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <tr style={tableTr} key={item}>
                    {["70%", "70%", "70%", "45%"].map((width, idx) => (
                      <td
                        key={idx}
                        className={`${idx === 3 ? "border-0 pt-2 pb-2" : "'"}`}
                      >
                        <LoaderDiv
                          height={idx === 3 ? "25" : "20"}
                          width={width}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recurring_dates?.length === 0 ? (
                <tr style={{ textAlign: "center", height: "300px" }}>
                  <td colSpan="4">No data found</td>
                </tr>
              ) : (
                recurring_dates?.map((dateEntry, index) => {
                  const recurringType =
                    recurringTypeStatus[dateEntry?.status.toLowerCase()];
                  return (
                    <tr style={tableTr} key={index}>
                      <td className="text-black">
                        {formatDate(dateEntry.recurring_date)}
                      </td>
                      <td>
                        <div className={`act-amt-wrap cx-color-green p-0`}>
                          <WrapAmount
                            value={dateEntry.installment_amount || 0}
                            prefix={`${CURRENCY_SYMBOL} `}
                          />
                        </div>
                      </td>
                      <td className="freq-date-rec-td">
                        <div className={recurringType?.className || ""}>
                          {recurringType?.status ||
                            dateEntry?.status?.toUpperCase()}
                        </div>
                      </td>
                      <td className="border-0 pt-2 pb-2">
                        <div className="act-edit-btn">
                          <div className="d-flex right-activity-div">
                            <button
                              className={`act-edit-wrap ${
                                adminApprovedWithRenewCheck &&
                                dateEntry?.status.toLowerCase() === "pending"
                                  ? ""
                                  : "contacts-admin-approved-disabled"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddAmountPopup(true);
                              }}
                              style={{
                                background: "#936EE3",
                                width: "33px",
                                height: "32px",
                                borderRadius: "50px",
                              }}
                              disabled={
                                disableComponent ||
                                dateEntry?.status.toLowerCase() !== "pending"
                              }
                            >
                              <IconEdit style={{ stroke: "#FFF" }} />
                            </button>
                            <button
                              className={`act-del-wrap ${
                                adminApprovedWithRenewCheck &&
                                dateEntry?.status.toLowerCase() === "pending"
                                  ? ""
                                  : "contacts-admin-approved-disabled"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeletePopup(true);
                              }}
                              style={{
                                background: "#FF3333",
                                borderRadius: "50px",
                              }}
                              disabled={
                                disableComponent ||
                                dateEntry?.status.toLowerCase() !== "pending"
                              }
                            >
                              <IconBin style={{ stroke: "#F3F3F3" }} />
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
        <ModalAddAmount
          id="set-qr-amount"
          show={addAmountPopup}
          setShow={setAddAmountPopup}
          heading="Enter Amount"
          subHeading=""
          handleCallback={handleSubmitAmount}
          error={"error"}
        />
        <ModalConfirmation
          id="delete-group-member-popup"
          show={showDeletePopup}
          setShow={setShowDeletePopup}
          heading={"Delete Recurring"}
          subHeading={
            <span
              className=""
              style={{ whiteSpace: "normal", wordWrap: "break-word" }}
            >
              Are you sure you want to delete this record?
            </span>
          }
          handleCallback={handleCallbackTransaction}
        />
      </div>
    </>
  );
};

export default SectionRecurringDates;
