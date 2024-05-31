import React from "react";
import LoaderDiv from "loaders/LoaderDiv";
import { recurringTypeStatus } from "constants/all";

const SectionRecurringDates = (props) => {
  const isLoading = props?.loading;
  const tableTr = {
    marginBottom: "25px",
  };

  const { recurring_dates = [] } = props?.details || {};

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="d-flex flex-wrap w-100">
      <div className="w-100-md rcr-transition-info rcr-transition-info-1">
        <table>
          <thead className="freq-date-header">
            <tr>
              <th>Frequency Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4, 5]?.map((item) => (
                <tr style={tableTr} key={item}>
                  <td>
                    <LoaderDiv height="20" width="70%" />
                  </td>
                  <td>
                    <LoaderDiv height="20" width="100%" />
                  </td>
                </tr>
              ))
            ) : recurring_dates?.length === 0 ? (
              <tr style={{ textAlign: "center", height: "300px" }}>
                <td colSpan="2">No data found</td>
              </tr>
            ) : (
              recurring_dates?.map((dateEntry, index) => {
                const recurringType =
                  recurringTypeStatus[dateEntry?.status.toLowerCase()];
                return (
                  <tr style={tableTr} key={index}>
                    <td>{formatDate(dateEntry.recurring_date)}</td>
                    <td className="freq-date-rec-td">
                      <div className={recurringType?.className || ""}>
                        {recurringType?.status || dateEntry?.status?.toUpperCase()}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionRecurringDates;
