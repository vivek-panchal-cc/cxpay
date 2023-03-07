import { Modal } from "bootstrap";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { apiRequest } from "helpers/apiRequests";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CardItem from "./component/CardItem";

function ViewCard(props) {
  const [cardsList, setCardsList] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deleteCard, setDeleteCard] = useState(null);

  const getCardsList = async () => {
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      setCardsList(data.data.cards);
    } catch (error) {
      console.log(error);
      setCardsList([]);
    }
  };

  const handleConfirmDelete = (card) => {
    setShowConfirmPopup(true);
    setDeleteCard(card);
  };

  const handleCardDelete = async () => {
    setShowConfirmPopup(false);
    try {
      const { data } = await apiRequest.deleteCard({ id: deleteCard.id });
      if (!data.success) throw data.message;
      getCardsList();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    getCardsList();
  }, []);

  return (
    <div className="">
      <ModalConfirmation
        heading="Are you sure?"
        subHeading="you want to delete this card"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        handleCallback={handleCardDelete}
      ></ModalConfirmation>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {cardsList?.map((item, index) => (
              <CardItem
                key={`${item.card_number}${index}`}
                item={item}
                handleDelete={handleConfirmDelete}
              />
            ))}
          </ul>
        </div>
      </div>
      <div className="view_bank_listing_bottom-wrap">
        <Link to="/wallet/add-card">+ Add new Card</Link>
      </div>
    </div>
  );
}

export default ViewCard;
