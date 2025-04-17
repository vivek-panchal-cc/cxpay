import React, { useContext, useState } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import {
  capitalizeWordByWord,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import LoaderJarDashboard from "loaders/LoaderJarDashboard";
import { Link, useNavigate } from "react-router-dom";
import { IconJarCreate, IconJarCalendar, IconGear } from "styles/svgs";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import LoaderJarActions from "loaders/LoaderJarActions";
import JarMemberListingModal from "components/modals/JarMemberListingModal";
import ModalJarPaymentSelect from "components/modals/ModalJarPaymentSelect";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";

const SavingJarProgress = (props) => {
  const navigate = useNavigate();
  const {
    savingJarDetails,
    tabName,
    graphLoading,
    getJarMemberList,
    reloadJarAct,
  } = props;
  const {
    jar_id,
    jar_icon,
    jar_name,
    jar_category_name,
    deposite_amount: raw_deposite_amount,
    target_amount: raw_target_amount,
    target_date,
    status = true,
    reserve_amount: raw_reserve_amount,
    card_bg_color,
    card_scroll_color,
    card_button_bg_color,
  } = savingJarDetails;
  const deposite_amount = Number(raw_deposite_amount);
  const target_amount = Number(raw_target_amount);
  const reserve_amount = Number(raw_reserve_amount);
  const {
    handleEditJarData,
    addJarMembers,
    handleRecurringPaymentForSharedUser,
    handleSetShowTransferToWalletPopup,
    handleCreatedJarData,
    handleInstantPaymentForAddAmount,
    handleRecurringPaymentForAddAmount,
    createdJarData,
    handleSendJarScheduleForAddAmount,
  } = useContext(SavingJarOwnContext);
  const { profile } = useSelector((state) => state.userProfile);
  const { admin_approved } = profile || {};
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const [jarMembers, setJarMembers] = useState([]);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showModalScheduler, setShowModalScheduler] = useState(false);

  const handleJarEdit = async () => {
    if (handleJarEdit) await handleEditJarData(savingJarDetails);
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  // const handleSelectMembers = async (item) => {
  //   setJarMembers([...item]);
  //   if (addJarMembers) await addJarMembers(jar_id, item);
  //   getJarMemberList(jar_id, "");
  //   reloadJarAct(1);
  // };

  const handleSelectMembers = async (item) => {
    setJarMembers([...item]);
    if (handleCreatedJarData)
      handleCreatedJarData({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
      });
    if (handleRecurringPaymentForSharedUser)
      await handleRecurringPaymentForSharedUser({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
        members: item,
        isMember: true,
      });
  };

  const handleInstantPaymentSend = () => {
    if (handleInstantPaymentForAddAmount)
      handleInstantPaymentForAddAmount({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
      });
    setShowPaymentModal(false);
    reloadJarAct(2);
  };

  const handleSchedulePayment = () => {
    if (handleCreatedJarData)
      handleCreatedJarData({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
      });
    setShowPaymentModal(false);
    setShowModalScheduler(true);
    reloadJarAct(3);
  };

  const handleRecurringPayment = () => {
    if (handleCreatedJarData)
      handleCreatedJarData({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
      });
    if (handleRecurringPaymentForAddAmount)
      handleRecurringPaymentForAddAmount({
        ...savingJarDetails,
        target_date: savingJarDetails.target_date
          .split("-")
          .reverse()
          .join("-"),
      });
    setShowPaymentModal(false);
    reloadJarAct(4);
  };

  const isSameOrPastDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    return targetDate < today;
  };

  const isTargetDateExpired = target_date && isSameOrPastDate(target_date);
  const isAmountEqual = deposite_amount >= target_amount;
  const isTrue = isTargetDateExpired || isAmountEqual;
  return (
    <>
      {/* <div
        className="dashboard-graph-wrap rounded-4"
        style={{
          background: `url(${graphBackgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      > */}
      <div className="w-100">
        {/* <div className="d-flex"> */}
        {graphLoading ? (
          <LoaderJarDashboard
            // backgroundColor={card_bg_color || "#a279e4"}
            backgroundColor={"#c4c4c4" || card_bg_color}
            foregroundColor={"#ecebeb" || "#7a59af"}
            height="189"
            width="100%"
          />
        ) : (
          <div
            className="jar-card"
            style={{ background: card_bg_color || "#a279e4" }}
          >
            <div className="jar-header">
              <div className="jar-details">
                {jar_icon ? (
                  <img
                    src={jar_icon}
                    className="jar-icon"
                    alt="Sub-account Icon"
                  />
                ) : (
                  <div
                    className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                      jar_name
                    )}`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    {getInitials(jar_name)}
                  </div>
                )}
                <div>
                  <h5 className="jar-name">{jar_name}</h5>
                  <p className="jar-category">
                    {capitalizeWordByWord(jar_category_name)}
                  </p>
                </div>
                {status && adminApprovedWithRenewCheck && tabName === "own" && (
                  <div
                    className={`jar-settings ${
                      adminApprovedWithRenewCheck
                        ? ""
                        : "admin-approved-disabled"
                    }`}
                    onClick={adminApprovedWithRenewCheck ? handleJarEdit : null}
                  >
                    {/* <IconJarCreate /> */}
                    <IconGear fill="#fff" />
                  </div>
                )}
              </div>
            </div>

            <div className="jar-balance">
              <h2 className="jar-amount">
                <WrapAmount value={deposite_amount} />
              </h2>
              <span className="jar-target">
                {"/"}&nbsp;
                <WrapAmount value={target_amount} />
              </span>
            </div>

            <div className="progress-section">
              <div
                className="progress-bar"
                style={{ background: card_scroll_color || "#7b5baf" }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${(deposite_amount / target_amount) * 100}%`,
                  }}
                />
              </div>
              <span className="jar-date">
                {reserve_amount ? (
                  <span className="reserve-amount">
                    Reserved Amount:&nbsp;
                    <WrapAmount value={reserve_amount} />
                  </span>
                ) : (
                  <span></span>
                )}
                <span className="date-container">
                  <IconJarCalendar className="calendar-icon" />
                  {target_date && target_date.split("-").reverse().join("/")}
                </span>
              </span>
            </div>
          </div>
        )}
        {status &&
          adminApprovedWithRenewCheck &&
          (graphLoading ||
            tabName === "shared" ||
            (!isTrue && tabName === "own") ||
            (isTrue && tabName === "own") ||
            !isTrue) && (
            <div
              className="jar-actions"
              // style={{ background: card_button_bg_color || "#936ee31a" }}
              style={{ background: card_button_bg_color || "#e3e1e1" }}
            >
              {graphLoading ? (
                [1, 2, 3].map((item) => <LoaderJarActions key={item} />)
              ) : (
                <>
                  {!isTrue && tabName === "own" && (
                    <a
                      className="action-button"
                      onClick={() => showAddMemberPopupData()}
                    >
                      <img src="/assets/images/jar_share.svg" alt="" />
                      <span>Share Sub-account</span>
                    </a>
                  )}

                  {isTrue && tabName === "own" && (
                    <>
                      <a
                        className={`${
                          deposite_amount <= 0
                            ? "action-button jar-action-button-disabled"
                            : "action-button"
                        }`}
                        onClick={() =>
                          deposite_amount <= 0
                            ? null
                            : handleSetShowTransferToWalletPopup(jar_id)
                        }
                      >
                        <img
                          src="/assets/images/jar_transfer_to_wallet.svg"
                          alt=""
                        />
                        <span>Redeem Fund</span>
                      </a>
                      <a
                        className="action-button"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        <img
                          src="/assets/images/jar_fund_transfer.svg"
                          alt=""
                        />
                        <span>Add Fund</span>
                      </a>
                    </>
                  )}

                  {(!isTrue || tabName === "shared") && (
                    <a
                      className="action-button"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <img src="/assets/images/jar_fund_transfer.svg" alt="" />
                      <span>Add Fund</span>
                    </a>
                  )}
                </>
              )}
            </div>
          )}
      </div>
      <JarMemberListingModal
        id="jar-delete-group-popup"
        show={showAddMemberPopup}
        setShow={setShowAddMemberPopup}
        handleCallback={() => setShowAddMemberPopup(false)}
        className={`con-list-pop`}
        jarId={jar_id}
        selectedItem={() => {}}
        selectedFullItem={handleSelectMembers}
        selectedMembers={jarMembers}
      />
      <ModalPaymentScheduler
        classNameChild="schedule-time-modal"
        show={showModalScheduler}
        setShow={setShowModalScheduler}
        handleSubmit={handleSendJarScheduleForAddAmount}
        data={createdJarData}
      />
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
    </>
  );
};

export default SavingJarProgress;
