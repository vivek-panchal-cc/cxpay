import React, { useContext, useState } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import {
  capitalizeWordByWord,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import LoaderJarDashboard from "loaders/LoaderJarDashboard";
import { Link } from "react-router-dom";
import { IconJarCreate, IconJarCalendar } from "styles/svgs";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import LoaderJarActions from "loaders/LoaderJarActions";
import JarMemberListingModal from "components/modals/JarMemberListingModal";

const SavingJarProgress = (props) => {
  const { savingJarDetails, tabName, graphLoading, getJarMemberList } = props;
  const {
    jar_id,
    jar_icon,
    jar_name,
    jar_category_name,
    deposite_amount,
    target_amount,
    target_date,
    status = true,
  } = savingJarDetails;
  const { handleEditJarData, addJarMembers } = useContext(SavingJarOwnContext);
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

  const handleJarEdit = async () => {
    if (handleJarEdit) await handleEditJarData(savingJarDetails);
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  const handleSelectMembers = async (item) => {
    setJarMembers([...item]);
    if (addJarMembers) await addJarMembers(jar_id, item);
    getJarMemberList(jar_id, "");
  };

  const isSameOrPastDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00

    return targetDate < today;
  };

  const isTargetDateExpired = target_date && isSameOrPastDate(target_date);
  const isAmountEqual = target_amount === deposite_amount;
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
            backgroundColor="#a279e4"
            height="189"
            width="100%"
          />
        ) : (
          <div className="jar-card">
            <div className="jar-header">
              <div className="jar-details">
                {jar_icon ? (
                  <img src={jar_icon} className="jar-icon" alt="Jar Icon" />
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
                {status && adminApprovedWithRenewCheck && (
                  <div
                    className={`jar-settings ${
                      adminApprovedWithRenewCheck
                        ? ""
                        : "admin-approved-disabled"
                    }`}
                    onClick={adminApprovedWithRenewCheck ? handleJarEdit : null}
                  >
                    <IconJarCreate />
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
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(deposite_amount / target_amount) * 100}%`,
                  }}
                />
              </div>
              <span className="jar-date">
                <IconJarCalendar className="calendar-icon" />
                {target_date && target_date.split("-").reverse().join("/")}
              </span>
            </div>
          </div>
        )}
        {adminApprovedWithRenewCheck && (
          <div className="jar-actions">
            {graphLoading ? (
              [1, 2, 3].map((item) => <LoaderJarActions key={item} />)
            ) : (
              <>
                {!isTrue && tabName === "own" && status && (
                  <a
                    className="action-button"
                    onClick={() => showAddMemberPopupData()}
                  >
                    <img src="/assets/images/jar_share.svg" alt="" />
                    <span>Share Jar</span>
                  </a>
                )}

                {(isTrue || !status) && (
                  <Link className="action-button">
                    <img
                      src="/assets/images/jar_transfer_to_wallet.svg"
                      alt=""
                    />
                    <span>Transfer to Wallet</span>
                  </Link>
                )}

                {!isTrue && status && (
                  <Link className="action-button">
                    <img src="/assets/images/jar_fund_transfer.svg" alt="" />
                    <span>Fund Transfer</span>
                  </Link>
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
    </>
  );
};

export default SavingJarProgress;
