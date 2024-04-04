import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const KycChecked = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const { kyc_approved_status = "" } = profile || "";
  const navigate = useNavigate();

  const redirectManualKyc = (e) => {
    try {
      navigate("/kyc-manual", {
        state: { kycStatus: true },
      });
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    } finally {
    }
  };

  return (
    <form>
      <div className="form-field kyc-checked">
        <input
          type="checkbox"
          id="kyc_approved_status"
          name="kyc_approved_status"
          checked={kyc_approved_status === "approved"}
          disabled
        />
        <label>KYC</label>
        {/* <ul>
          <li>
            <div className="kyc-info-right-desc">
              <div className="d-flex justify-content-center align-items-center column-gap-3">
                <button
                  type="button"
                  className="badge rounded-pill text-bg-primary border-0 border-primary"
                  onClick={redirectManualKyc}
                >
                  Renew KYC
                </button>
              </div>
            </div>
          </li>
        </ul> */}
      </div>
    </form>
  );
};

export default KycChecked;
