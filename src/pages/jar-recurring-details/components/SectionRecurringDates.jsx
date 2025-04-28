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
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const SectionRecurringDates = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const [amountError, setAmountError] = useState("");
  const [items, setItems] = useState({});
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
  const tableTr = {
    marginBottom: "25px",
  };

  const { details, setIsDataRefresh, loading } = props;
  const { recurring_dates = [], id, jar_id } = details || {};

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleModal = () => {
    setAddAmountPopup((am) => !am);
    setAmountError("");
  };

  const handleSubmitAmount = async (values) => {
    setIsLoading(true);
    try {
      const reqParams = {
        jar_id: jar_id,
        payment_id: id,
        occurrence_id: items.occurrence_id,
        amount: values.amount,
        recurring_date: values.recurring_date,
      };
      const { data } = await apiRequest.updateRecurringOccurrenceAmount(
        reqParams
      );
      if (!data.success) throw data.message;
      toast.success(data.message);
      setAddAmountPopup(false);
      setIsDataRefresh((cs) => !cs);
      setAmountError("");
    } catch (error) {
      setAmountError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallbackTransaction = async () => {
    setIsLoading(true);
    try {
      const reqParams = {
        jar_id: jar_id,
        payment_id: id,
        occurrence_id: items.occurrence_id,
      };
      const { data } = await apiRequest.deleteRecurringOccurrence(reqParams);
      if (!data.success) throw data.message;
      toast.success(data.message);
      setIsDataRefresh((cs) => !cs);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setShowDeletePopup(false);
      setIsLoading(false);
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
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <tr style={tableTr} key={item}>
                    {["70%", "70%", "70%", "45%"].map((width, idx) => (
                      <td
                        key={idx}
                        className={`${idx === 3 ? "border-0 pt-2 pb-2" : ""}`}
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
                  <td colSpan="4" className="border-0">
                    No data found
                  </td>
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
                          <div className="d-flex jar-rec-buttons right-activity-div">
                            <button
                              className={`act-edit-wrap ${
                                adminApprovedWithRenewCheck &&
                                dateEntry?.status.toLowerCase() === "pending"
                                  ? ""
                                  : "contacts-admin-approved-disabled"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setItems(dateEntry);
                                setAddAmountPopup(true);
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
                                setItems(dateEntry);
                                setShowDeletePopup(true);
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
          setShow={handleModal}
          heading="Enter Amount"
          subHeading=""
          handleCallback={handleSubmitAmount}
          error={amountError}
          values={items}
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
