import WrapAmount from "components/wrapper/WrapAmount";
import useCountUp from "hooks/useCountUp";
import React from "react";
import { IconDashSubAcc } from "styles/svgs";

const SubAccountsCard = (props) => {
  const { loading, statistics, getSubAccountsStatistics } = props;
  const {
    my_deposit = "",
    shared_deposit = "",
    my_reserved_balance = "",
    shared_reserved_balance = "",
    my_share = "",
    shared_share = "",
    my_shared_reserve = "",
    shared_reserved_share = "",
  } = statistics;

  // Own Statistics
  const myDeposit = useCountUp(my_deposit);
  const sharedDeposit = useCountUp(shared_deposit);
  const myReserved = useCountUp(my_reserved_balance);
  const sharedReserved = useCountUp(shared_reserved_balance);

  // Shared Statistics
  const myShare = useCountUp(my_share);
  const sharedShare = useCountUp(shared_share);
  const mySharedReserve = useCountUp(my_shared_reserve);
  const sharedReservedShare = useCountUp(shared_reserved_share);

  return (
    <div className="sub-accounts-container">
      <div className="section">
        <div className="section-header">
          <span className="icon">
            <IconDashSubAcc />
          </span>{" "}
          Own Sub-accounts
        </div>
        <div className="account-grid">
          <div className="account-column first-column">
            <div className="account-box">
              <p className="label">My Deposit</p>
              <p className="value">
                <WrapAmount value={myDeposit || 0} />
              </p>
            </div>
            <div className="account-box">
              <p className="label">My Reserved Balance</p>
              <p className="value">
                <WrapAmount value={myReserved || 0} />
              </p>
            </div>
          </div>
          <div className="divider" />
          <div className="account-column">
            <div className="account-box">
              <p className="label">Shared Deposit</p>
              <p className="value">
                <WrapAmount value={sharedDeposit || 0} />
              </p>
            </div>
            <div className="account-box">
              <p className="label">Shared Reserved Balance</p>
              <p className="value">
                <WrapAmount value={sharedReserved || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="icon">
            <IconDashSubAcc />
          </span>{" "}
          Shared Sub-accounts
        </div>
        <div className="account-grid">
          <div className="account-column first-column">
            <div className="account-box">
              <p className="label">My Share</p>
              <p className="value">
                <WrapAmount value={myShare || 0} />
              </p>
            </div>
            <div className="account-box">
              <p className="label">My Shared Reserve</p>
              <p className="value">
                <WrapAmount value={mySharedReserve || 0} />
              </p>
            </div>
          </div>
          <div className="divider" />
          <div className="account-column">
            <div className="account-box">
              <p className="label">Shared Share</p>
              <p className="value">
                <WrapAmount value={sharedShare || 0} />
              </p>
            </div>
            <div className="account-box">
              <p className="label">Shared Reserved Share</p>
              <p className="value">
                <WrapAmount value={sharedReservedShare || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAccountsCard;
