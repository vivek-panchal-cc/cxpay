import WrapAmount from "components/wrapper/WrapAmount";
import LoaderDiv from "loaders/LoaderDiv";
import React from "react";

const SectionRecurringGroupList = (props) => {
  const isLoading = props?.loading;
  const tableTh = {
    padding: "0px 10px",
  };

  const { payload = [] } = props?.details || {};

  return (
    <div className="rcr-innner-wrap rcr-table-hover rcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md rcr-transition-info rcr-transition-info-1">
        <label className="rcr-group-label">Group Members</label>
        <table>
          <thead className="freq-date-header">
            <tr>
              <th style={tableTh}>Name</th>
              <th style={tableTh}>Specification</th>
              <th style={tableTh}>Amount</th>
            </tr>
          </thead>
          <tbody className="group-member-box-shadow">
            {isLoading
              ? [1, 2, 3, 4, 5]?.map((item) => (
                  <tr key={item}>
                    <td className="gl-td-1">
                      <LoaderDiv height="20" width="70%" />
                    </td>
                    <td className="gl-td-2">
                      <LoaderDiv height="20" width="70%" />
                    </td>
                    <td className="gl-td-3">
                      <LoaderDiv height="20" width="70%" />
                    </td>
                  </tr>
                ))
              : payload
                  ?.filter(
                    (dateEntry) =>
                      dateEntry.member_name ||
                      dateEntry.specification ||
                      dateEntry.amount
                  )
                  ?.map((dateEntry, index) => (
                    <tr key={index}>
                      <td className="gl-td-1">{dateEntry.member_name}</td>
                      <td className="gl-td-2">{dateEntry.specification}</td>
                      <td className="gl-td-3">
                        <WrapAmount value={dateEntry.amount} />
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionRecurringGroupList;
