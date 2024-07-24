import WrapAmount from "components/wrapper/WrapAmount";
import { withdrawConsts } from "constants/all";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import LoaderDiv from "loaders/LoaderDiv";
import React, { useContext } from "react";

const SectionTransactionDetails = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );

  const {
    transaction_id = "",
    date = "",
    total_amount = "",
    fees = "",
    status = "",
  } = details || {};

  const [w_dt, w_tm] = date ? date.split("|") : [];

  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md wcr-transition-info wcr-transition-info-1">
        <table>
          <tbody>
            <tr>
              <td>Transaction ID</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  transaction_id
                )}
              </td>
            </tr>
            <tr>
              <td>Date</td>
              <td>
                {isLoading ? <LoaderDiv height="20" width="50%" /> : w_dt}
              </td>
            </tr>
            <tr>
              <td>Time</td>
              <td>
                {isLoading ? <LoaderDiv height="20" width="50%" /> : w_tm}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-50-md wcr-transition-info wcr-transition-info-2">
        <table>
          <tbody>
            <tr>
              <td>Amount</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  <WrapAmount value={total_amount} />
                )}
              </td>
            </tr>
            <tr>
              <td>Fees</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  <WrapAmount value={fees} />
                )}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  <span
                    className={`${withdrawConsts?.[status]?.classText || ""}`}
                  >
                    {status}
                  </span>
                )}

                {/* <span className="green">Success</span> /{" "} */}
                {/* <span className="red">Failed</span> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionTransactionDetails;
