import React, { useContext } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import {
  capitalizeWordByWord,
  getInitials,
  getRandomColorClass,
} from "constants/all";
import LoaderJarDashboard from "loaders/LoaderJarDashboard";
import { Link } from "react-router-dom";
import { IconJarCreate, IconJarCalendar } from "styles/svgs";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";

const SavingJarProgress = (props) => {
  const { savingJarDetails, graphLoading } = props;
  const { handleEditJarData } = useContext(SavingJarOwnContext);

  const handleJarEdit = async () => {
    if (handleJarEdit) await handleEditJarData(savingJarDetails);
  };

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
            height="200"
            width="100%"
          />
        ) : (
          <div className="jar-card">
            <div className="jar-header">
              <div className="jar-details">
                {savingJarDetails?.jar_icon ? (
                  <img
                    src={savingJarDetails?.jar_icon}
                    className="jar-icon"
                    alt="Jar Icon"
                  />
                ) : (
                  <div
                    className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                      savingJarDetails?.jar_name
                    )}`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    {getInitials(savingJarDetails?.jar_name)}
                  </div>
                )}
                <div>
                  <h5 className="jar-name">{savingJarDetails?.jar_name}</h5>
                  <p className="jar-category">
                    {capitalizeWordByWord(savingJarDetails?.jar_category_name)}
                  </p>
                </div>
                <div className="jar-settings" onClick={handleJarEdit}>
                  <IconJarCreate />
                </div>
              </div>
            </div>

            <div className="jar-balance">
              <h2 className="jar-amount">
                <WrapAmount value={savingJarDetails?.deposite_amount} />
              </h2>
              <span className="jar-target">
                {"/"}&nbsp;
                <WrapAmount value={savingJarDetails?.target_amount} />
              </span>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((savingJarDetails?.deposite_amount || 500) /
                        (savingJarDetails?.target_amount || 2000)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="jar-date">
                <IconJarCalendar className="calendar-icon" />
                {savingJarDetails?.target_date &&
                  savingJarDetails.target_date.split("-").reverse().join("/")}
              </span>
            </div>
          </div>
        )}
        <div className="jar-actions">
          <Link className="action-button">
            <img src="/assets/images/jar_share.svg" alt="" />
            <span>Share Jar</span>
          </Link>

          <Link className="action-button">
            <img src="/assets/images/jar_transfer_to_wallet.svg" alt="" />
            <span>Transfer to Wallet</span>
          </Link>

          <Link className="action-button">
            <img src="/assets/images/jar_fund_transfer.svg" alt="" />
            <span>Fund Transfer</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SavingJarProgress;
