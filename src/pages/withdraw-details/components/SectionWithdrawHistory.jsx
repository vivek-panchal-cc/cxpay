import React from "react";

const SectionWithdrawHistory = () => {
  return (
    <div className="py-3 my-3 border border-start-0 border-end-0">
      <p className="fs-6 text-center">Withdray History</p>
      <ul>
        {[1, 2, 3, 4, 5].map((widro) => (
          <li key={widro} className="mb-2">
            <div className="d-flex justify-content-between">
              <div className="">
                <p className="m-0">ID: WDRE12333CEEQ</p>
                <p className="m-0">5th May 2023</p>
              </div>
              <div className="">- 100 ANG</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionWithdrawHistory;
