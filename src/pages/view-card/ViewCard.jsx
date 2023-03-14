import { apiRequest } from "helpers/apiRequests";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CardItem from "./component/CardItem";

function ViewCard(props) {
  const [cardsList, setCardsList] = useState([]);

  const getCardsList = async () => {
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      console.log(data.data.cards);
      setCardsList(data.data.cards);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCardsList();
  }, []);

  return (
    <div className="">
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {cardsList?.map((item, index) => (
              <CardItem item={item} key={index} />
            ))}
          </ul>
        </div>
      </div>
      <div className="view_bank_listing_bottom-wrap">
        <Link to="/wallet/link-bank">+ Add Bank Account</Link>
      </div>
    </div>
  );
}

export default ViewCard;
