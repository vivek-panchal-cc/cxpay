import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import LoaderDiv from "loaders/LoaderDiv";

const SectionRecurringDetails = (props) => {
  const isLoading = props?.loading;

  const tableTr = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "25px",
  };

  const {
    amount = "",
    frequency = "",
    created_at = "",
    fees_total = "",
    no_of_occurrence = "",
    recurring_end_date = "",
    recurring_start_date = "",
  } = props?.details || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDay = ("0" + date.getDate()).slice(-2); // Ensures it is two digits
    const formattedMonth = ("0" + (date.getMonth() + 1)).slice(-2); // Ensures it is two digits
    const formattedYear = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

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
              <td>Start Date</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  formatDate(recurring_start_date)
                )}
              </td>
            </tr>
            <tr style={tableTr}>
              <td>Frequency</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  frequency.toUpperCase()
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-35-md rcr-transition-info rcr-transition-info-2">
        <table>
          <tbody>
            <tr style={tableTr}>
              <td>Created Date</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  formatDate(created_at)
                )}
              </td>
            </tr>
            <tr style={tableTr}>
              <td>End Date</td>
              <td>
                {isLoading ? (
                  <LoaderDiv height="20" width="50%" />
                ) : (
                  formatDate(recurring_end_date)
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
