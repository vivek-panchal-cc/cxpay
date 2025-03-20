import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
} from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ModalJarPaymentSelect from "components/modals/ModalJarPaymentSelect";
import WrapAmount from "components/wrapper/WrapAmount";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";
import ModalConfirmation from "components/modals/ModalConfirmation";
import JarMemberListingModal from "components/modals/JarMemberListingModal";

const OwnJarListItem = (props) => {
  const { details, tabList, active = false } = props;
  const navigate = useNavigate();
  const {
    handleCreatedJarData,
    createdJarData,
    handleStoreJarId,
    handleTabList,
    handleInstantPaymentForAddAmount,
    handleSendJarScheduleForAddAmount,
    handleRecurringPaymentForAddAmount,
    confirmAcceptOrDeclineTransaction,
    addJarMembers,
    handleSetShowTransferToWalletPopup,
  } = useContext(SavingJarOwnContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showModalScheduler, setShowModalScheduler] = useState(false);
  const [acceptRejectValue, setAcceptRejectValue] = useState(null);
  const [popup, setPopup] = useState(false);
  const [jarMembers, setJarMembers] = useState([]);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const handleInstantPaymentSend = () => {
    if (handleInstantPaymentForAddAmount)
      handleInstantPaymentForAddAmount(details);
    setShowPaymentModal(false);
  };

  const handleSchedulePayment = () => {
    if (handleCreatedJarData) handleCreatedJarData(details);
    setShowPaymentModal(false);
    setShowModalScheduler(true);
  };

  const handleRecurringPayment = () => {
    if (handleCreatedJarData) handleCreatedJarData(details);
    if (handleRecurringPaymentForAddAmount)
      handleRecurringPaymentForAddAmount(details);
    setShowPaymentModal(false);
  };

  const handleAcceptOrRejectDetails = (value) => {
    setAcceptRejectValue(value);
    setPopup(true);
  };

  const handleCallbackTransaction = async () => {
    setPopup(false);
    await confirmAcceptOrDeclineTransaction(acceptRejectValue, details.jar_id);
    setAcceptRejectValue(null);
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  const handleSelectMembers = async (item) => {
    setJarMembers([...item]);
    if (addJarMembers) await addJarMembers(details.jar_id, item);
  };

  const isSameOrPastDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDateStr = dateStr.split("-").reverse().join("-");
    const targetDate = new Date(formattedDateStr);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  };

  const renderButtons = () => {
    const isFundActionDisabled =
      show_renew_section === "disable_fund_action" ||
      show_renew_section === "renew_limit_exceed_and_disable";

    const isDisabled = !(admin_approved && !isFundActionDisabled);
    const getButtonClass = (extraClass = "") =>
      `btn ${
        isDisabled ? "contacts-admin-approved-disabled" : extraClass
      }`.trim();

    const renderButton = (
      label,
      onClick,
      extraClass = "",
      style = {},
      disabled = false
    ) => (
      <button
        className={getButtonClass(extraClass)}
        style={style}
        onClick={isDisabled ? undefined : onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );

    const isTargetDateExpired =
      details?.target_date && isSameOrPastDate(details.target_date);
    const isAmountEqual = details?.deposite_amount === details?.target_amount;

    if (tabList === "own" && active) {
      const isRedeemDisabled = details?.deposite_amount <= 0;
      return (
        <div className="con-listing-btn-wrap">
          {isAmountEqual || isTargetDateExpired ? (
            renderButton(
              "Redeem Fund",
              (e) => {
                e.stopPropagation();
                handleSetShowTransferToWalletPopup(details.jar_id);
              },
              isRedeemDisabled ? "contacts-admin-approved-disabled" : "",
              {
                minWidth: "150px",
                marginRight: "0px",
              },
              isRedeemDisabled
            )
          ) : (
            <>
              {renderButton(
                "Share Jar",
                (e) => {
                  e.stopPropagation();
                  showAddMemberPopupData();
                },
                "con-req-btn"
              )}
              {renderButton(
                "Add Fund",
                (e) => {
                  e.stopPropagation();
                  handleTabList(tabList);
                  setShowPaymentModal(true);
                },
                "",
                {
                  minWidth: "150px",
                }
              )}
            </>
          )}
        </div>
      );
    }
    if (tabList === "shared" && active) {
      return (
        <div className="con-listing-btn-wrap">
          {!isAmountEqual && !isTargetDateExpired
            ? renderButton(
                "Add Fund",
                (e) => {
                  e.stopPropagation();
                  handleTabList(tabList);
                  setShowPaymentModal(true);
                },
                "",
                {
                  minWidth: "150px",
                  marginRight: "0px",
                }
              )
            : null}
        </div>
      );
    }
    if (tabList === "invited" && active) {
      return (
        <div className="con-listing-btn-wrap">
          <>
            {renderButton(
              "Decline",
              (e) => {
                e.stopPropagation();
                handleAcceptOrRejectDetails(0);
              },
              "con-req-btn",
              {
                minWidth: "150px",
              }
            )}
            {renderButton(
              "Accept",
              (e) => {
                e.stopPropagation();
                handleAcceptOrRejectDetails(1);
              },
              "",
              {
                minWidth: "150px",
              }
            )}
          </>
        </div>
      );
    }
  };

  const handleViewDetails = async (e) => {
    e.preventDefault();
    await handleStoreJarId(details.jar_id);
    await handleTabList(tabList);
    navigate(`/jars/own/jar-details`);
  };

  return (
    <>
      <li onClick={tabList === "invited" ? null : handleViewDetails}>
        <label className={`con-listing-info`} style={{ cursor: "pointer" }}>
          <div className="jar-con-list-uimg">
            {details?.jar_icon ? (
              <img src={details?.jar_icon} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  details?.jar_name
                )}`}
              >
                {getInitials(details?.jar_name)}
              </div>
            )}
          </div>

          <div className="con-list-uname">{details?.jar_name}</div>
        </label>
        <div className="con-listing-phone">
          {details.members.length === 0 ? (
            <p className="text-black">—</p>
          ) : (
            <div className="jar-avatar-group">
              {details.members.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="jar-avatar-item"
                  style={{ left: `${index * 20}px` }}
                >
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt={member.member_name}
                      className="jar-avatar-img"
                    />
                  ) : (
                    <div
                      className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                        member.member_name
                      )}`}
                      style={{ fontSize: "12px", borderRadius: "0px" }}
                    >
                      {getInitials(member.member_name)}
                    </div>
                  )}
                </div>
              ))}
              {details.members.length > 3 && (
                <div
                  className="jar-avatar-item jar-more-members"
                  style={{ left: `${3 * 20}px` }}
                >
                  +{details.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="jar-con-listing">
          <div className="jar-deposited-amount">
            <WrapAmount
              value={details?.deposite_amount}
              prefix={`${CURRENCY_SYMBOL} `}
            />
            &nbsp;
            <span className="jar-targeted-amount">
              <WrapAmount
                value={details?.target_amount}
                prefix={`/ ${CURRENCY_SYMBOL} `}
              />
            </span>
          </div>
          <div className="jar-progress-bar-container">
            <div
              className="jar-progress-bar"
              style={{
                width: `${
                  (details?.deposite_amount / details?.target_amount) * 100
                }%`,
                background:
                  (details?.deposite_amount / details?.target_amount) * 100 > 80
                    ? "#93DF6F"
                    : "#007bff",
              }}
            ></div>
          </div>
        </div>

        <div
          className="cont-listing-last-wrap"
          style={{ minWidth: "280px", justifyContent: "right" }}
        >
          {renderButtons()}
        </div>
      </li>
      <ModalJarPaymentSelect
        id="delete-group-popup"
        show={showPaymentModal}
        setShow={setShowPaymentModal}
        handleCallback={() => setShowPaymentModal(false)}
        className={`con-list-pop`}
        handleSchedulePayment={handleSchedulePayment}
        handleInstantPayment={handleInstantPaymentSend}
        handleRecurringPayment={handleRecurringPayment}
      />
      <ModalPaymentScheduler
        classNameChild="schedule-time-modal"
        show={showModalScheduler}
        setShow={setShowModalScheduler}
        handleSubmit={handleSendJarScheduleForAddAmount}
        data={createdJarData}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={popup}
        setShow={setPopup}
        heading={
          acceptRejectValue ? "Accept Transaction" : "Decline Transaction"
        }
        subHeading={`Are you sure you want to ${
          acceptRejectValue ? "accept" : "decline"
        } this transaction?`}
        handleCallback={handleCallbackTransaction}
      />
      <JarMemberListingModal
        id="jar-delete-group-popup"
        show={showAddMemberPopup}
        setShow={setShowAddMemberPopup}
        handleCallback={() => setShowAddMemberPopup(false)}
        className={`con-list-pop`}
        jarId={details.jar_id}
        selectedItem={() => {}}
        selectedFullItem={handleSelectMembers}
        selectedMembers={jarMembers}
      />
    </>
  );
};

export default OwnJarListItem;
