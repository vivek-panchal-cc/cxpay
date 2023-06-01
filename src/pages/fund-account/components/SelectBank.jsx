import React, { useContext, useEffect, useState } from "react";
import { FundContext } from "context/fundContext";
import BankCard from "components/cards/BankCard";
import { useSelector } from "react-redux";

function SelectBank() {
  const { banksList } = useSelector((state) => state.userWallet);
  const [selectedBank, setSelectedBank] = useState({});
  const { formik, integrateBankDetails, handleSelectExistingBank } =
    useContext(FundContext);

  useEffect(() => {
    if (!formik?.values?.bank_id || !banksList) return;
    const bank = banksList.find((item) => item.id === formik.values.bank_id);
    setSelectedBank(bank);
  }, [formik]);

  const handleSelectFromExistingBank = (radioe, bankId) => {
    const checked = radioe.currentTarget.checked;
    if (!checked) return;
    const bank = banksList?.find((item) => item.id === bankId);
    setSelectedBank(bank);
  };

  const handleProceed = () => {
    if (!selectedBank?.id) return;
    integrateBankDetails(selectedBank);
    handleSelectExistingBank(false);
  };

  return (
    <div className="">
      <div className="title-content-wrap send-pay-title-sec title-common-sec">
        <h3>My Bank Accounts</h3>
        <p>Choose a Bank Account</p>
      </div>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {banksList && banksList.length > 0 ? (
              banksList.map((item, index) => (
                <BankCard
                  key={`${item.id}`}
                  index={`${item.id}${index}`}
                  item={item}
                  defaultText={"Selected"}
                  defaultSelected={item.id === selectedBank?.id}
                  handleDefaultBank={handleSelectFromExistingBank}
                />
              ))
            ) : (
              <p className="text-center">Bank Account Not Found</p>
            )}
          </ul>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 p-0 btns-inline">
          <div className="setting-btn-link btn-wrap">
            <button
              type="button"
              className="outline-btn"
              onClick={() => handleSelectExistingBank(false)}
            >
              Cancel
            </button>
          </div>
          <div className="btn-wrap">
            <button
              type="button"
              className={`btn btn-primary`}
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectBank;
