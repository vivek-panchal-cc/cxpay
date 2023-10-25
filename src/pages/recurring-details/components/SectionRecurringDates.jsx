import LoaderDiv from "loaders/LoaderDiv";
import React from "react";

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

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "#FF7A00",
          backgroundColor: "yellow",
          borderRadius: "15px",
          fontSize: "12px",
          textAlign: "center",
          lineHeight: "24px",
          width: "89px",
          height: "revert",
        };
      case "success":
        return {
          color: "#56BE15",
          backgroundColor: "lightgreen",
          borderRadius: "15px",
          fontSize: "12px",
          textAlign: "center",
          lineHeight: "24px",
          width: "89px",
          height: "revert",
        };
      case "failed":
        return {
          color: "#FF3333",
          backgroundColor: "lightcoral",
          borderRadius: "15px",
          fontSize: "12px",
          textAlign: "center",
          lineHeight: "24px",
          width: "89px",
          height: "revert",
        };
      case "paid":
        return {
          color: "#56BE16",
          backgroundColor: "lightgreen",
          borderRadius: "15px",
          fontSize: "12px",
          textAlign: "center",
          lineHeight: "24px",
          width: "89px",
          height: "revert",
        };
      default:
        return {};
    }
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
            {isLoading
              ? [1, 2, 3, 4, 5]?.map((item) => (
                  <tr style={tableTr} key={item}>
                    <td>
                      <LoaderDiv height="20" width="70%" />
                    </td>
                    <td>
                      <LoaderDiv height="20" width="100%" />
                    </td>
                  </tr>
                ))
              : recurring_dates?.map((dateEntry, index) => (
                  <tr style={tableTr} key={index}>
                    <td>{formatDate(dateEntry.recurring_date)}</td>
                    <td className="freq-date-rec-td">
                      <div style={getStatusStyle(dateEntry.status)}>
                        {dateEntry.status.toLowerCase() === "pending"
                          ? "UPCOMING"
                          : dateEntry.status.toLowerCase() === "paid"
                          ? "SUCCESS"
                          : dateEntry.status}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionRecurringDates;
