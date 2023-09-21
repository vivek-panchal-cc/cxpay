import WrapAmount from "components/wrapper/WrapAmount";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import LoaderDiv from "loaders/LoaderDiv";
import React, { useContext } from "react";

const SectionRecurringDetails = (props) => {
  const { isLoading } = useContext(WithdrawDetailsContext);

  const tableTr = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "25px"
  }

  const {
    amount = "",
    frequency = "",
    overall_specification = "",
    created_date = "",
    fees_total = "",
  } = props?.details || {};

  return (
    <div className="rcr-innner-wrap rcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md rcr-transition-info rcr-transition-info-1 first-rec-detail">
        <table>
          <tbody>
            <tr style={tableTr}>
              <td>Amount</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  <WrapAmount value={amount} />
                )}
              </td>
            </tr>
            <tr style={tableTr}>
              <td>Fees</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  <WrapAmount value={fees_total} />
                )}
              </td>
            </tr>
            <tr style={tableTr}>
              <td>Frequency</td>
              <td>
                {isLoading ? <LoaderDiv height="20" width="50%" /> : frequency}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-35-md rcr-transition-info rcr-transition-info-2">
        <table>
          <tbody>
            <tr style={tableTr}>
              <td>Specification</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  overall_specification
                )}
              </td>
            </tr>
            <tr style={tableTr}>
              <td>Created Date</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  created_date
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionRecurringDetails;
