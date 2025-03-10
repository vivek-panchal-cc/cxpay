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

const OwnJarListItem = (props) => {
  const { details, tabList } = props;
  const navigate = useNavigate();
  const {
    handleCreatedJarData,
    createdJarData,
    handleStoreJarId,
    handleInstantPaymentForAddAmount,
    handleSendJarScheduleForAddAmount,
    handleRecurringPaymentForAddAmount,
  } = useContext(SavingJarOwnContext);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showModalScheduler, setShowModalScheduler] = useState(false);

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

  const renderButtons = () => {
    const isFundActionDisabled =
      show_renew_section === "disable_fund_action" ||
      show_renew_section === "renew_limit_exceed_and_disable";

    const isDisabled = !(admin_approved && !isFundActionDisabled);
    const getButtonClass = (extraClass = "") =>
      `btn ${
        isDisabled ? "contacts-admin-approved-disabled" : extraClass
      }`.trim();

    const renderButton = (label, onClick, extraClass = "", style = {}) => (
      <button
        className={getButtonClass(extraClass)}
        style={style}
        onClick={isDisabled ? undefined : onClick}
      >
        {label}
      </button>
    );

    if (tabList === "own") {
      return (
        <div className="con-listing-btn-wrap">
          {details?.deposite_amount === details?.target_amount ? (
            renderButton(
              "Redeem Fund",
              (e) => {
                e.stopPropagation();
              },
              "",
              {
                minWidth: "150px",
                marginRight: "0px",
              }
            )
          ) : (
            <>
              {renderButton(
                "Share Jar",
                (e) => {
                  e.stopPropagation();
                  // handleSendRequest([contact]);
                },
                "con-req-btn"
              )}
              {renderButton(
                "Add Fund",
                (e) => {
                  e.stopPropagation();
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
    if (tabList === "shared") {
      return (
        <div className="con-listing-btn-wrap">
          {renderButton(
            "Add Fund",
            (e) => {
              e.stopPropagation();
              setShowPaymentModal(true);
            },
            "",
            {
              minWidth: "150px",
              marginRight: "0px",
            }
          )}
        </div>
      );
    }
    if (tabList === "invited") {
      return (
        <div className="con-listing-btn-wrap">
          <>
            {renderButton(
              "Decline",
              (e) => {
                e.stopPropagation();
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
    </>
  );
};

export default OwnJarListItem;
