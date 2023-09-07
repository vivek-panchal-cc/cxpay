import React from "react";
import Button from "components/ui/Button";
import WrapAmount from "components/wrapper/WrapAmount";
import { useNavigate } from "react-router-dom";

function TopUpFundedPopup(props) {
  const navigate = useNavigate();
  const { fund, balance, setShow, userName } = props;

  const handleRedirect = () => {
    navigate("/top-up", { replace: true });
    setShow(false);
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <img src="/assets/images/fund-success-tick.svg" alt="" />
        </div>
        <div className="modal-body">
          <h3>
            <span className="transfer-amt">
              <WrapAmount value={fund} />
            </span>
            <br />
            Funded to {userName} account
          </h3>
          <p>
            Available balance
            <br />
            <span className="available-bal-acc">
              <WrapAmount value={balance} />
            </span>
          </p>
          <Button
            className="btn btn-primary fund-done-btn"
            onClick={handleRedirect}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TopUpFundedPopup;
