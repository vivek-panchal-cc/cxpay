import WrapAmount from "components/wrapper/WrapAmount";
import React from "react";

const SectionRecurringGroupList = (props) => {
  const tableTr = {
    marginBottom: "25px",
  };

  const { payload = [] } = props?.details || {};

  return (
    <div className="rcr-innner-wrap rcr-table-hover rcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md rcr-transition-info rcr-transition-info-1">
        <label className="rcr-group-label">Group Members</label>
        <table>
          <thead className="freq-date-header">
            <tr>
              <th>Name</th>
              <th>Specification</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="group-member-box-shadow">
            {payload?.map((dateEntry, index) => (
              <tr style={tableTr} key={index}>
                <td className="gl-td-1">{dateEntry.member_name}</td>
                <td className="gl-td-2">{dateEntry.specification}</td>
                <td className="gl-td-3"><WrapAmount value = {dateEntry.amount} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionRecurringGroupList;
