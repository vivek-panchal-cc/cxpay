import React from "react";
import WithdrawCardItem from "components/items/WithdrawCardItem";

const WithdrawCardList = () => {
  return (
    <ul className="my-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <WithdrawCardItem key={item} />
      ))}
    </ul>
  );
};

export default WithdrawCardList;
