import React from "react";
import { useSelector } from "react-redux";

const KycChecked = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const { is_kyc } = profile || "";

  return (
    <form>
      <div className="form-field kyc-checked">
        <input
          type="checkbox"
          id="is_kyc"
          name="is_kyc"
          checked={is_kyc}
          disabled
        />
        <label>KYC</label>
      </div>
    </form>
  );
};

export default KycChecked;
