import React, { useContext } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import { IconBank, IconCard } from "styles/svgs";
import LoaderWdrawHeader from "loaders/LoaderWdrawHeader";

const SectionHeader = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const {
    card_number = "",
    card_expiry_date = "",
    bank_name = "",
    bank_account_number = "",
    amount = "",
    status = "",
    specification = "",
  } = details || {};

  const name = withdrawType === "card" ? card_number : bank_name;

  return (
    <>
      <div className="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
        <div className="wcr-img-wrap wbr-img-wrap">
          <span bg-color="#000">
            {withdrawType === "card" ? <IconCard stroke="#363853" /> : null}
            {withdrawType === "bank" ? <IconBank stroke="#363853" /> : null}
          </span>
        </div>
        <div className="wcr-info-main">
          {isLoading ? (
            <div className="wcr-info-1 d-flex flex-wrap">
              <LoaderWdrawHeader
                loaderPorps={{ height: 20, width: "100%" }}
                divProps={{ rx: "5", ry: "5", width: "12%", height: "20" }}
              />
            </div>
          ) : (
            <div className="wcr-info-1 d-flex flex-wrap">
              <div className="wcr-card-data">
                <h2>{name}</h2>
                <p>
                  {withdrawType === "card"
                    ? card_expiry_date
                    : `xxxx xxxx xxxx ${bank_account_number?.substr(
                        bank_account_number?.length - 4
                      )}`}
                </p>
              </div>
              <div className="wcr-card-amt wbr-card-amt">
                <p className="green font-bold">{status}</p>
                <h2>
                  <WrapAmount value={amount} />
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="wcr-info-2">
        <h4 className="font-16-quick">Specifications</h4>
        <p>{specification}</p>
      </div>
    </>
  );
};

export default SectionHeader;
