import { Modal } from "bootstrap";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CardItem from "./component/CardItem";

function ViewCard(props) {
  const { setIsLoading } = useContext(LoaderContext);

  const [cardsList, setCardsList] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deleteCard, setDeleteCard] = useState(null);

  const getCardsList = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      setCardsList(data.data.cards);
    } catch (error) {
      console.log(error);
      setCardsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = (card) => {
    setShowConfirmPopup(true);
    setDeleteCard(card);
  };

  const handleCardDelete = async () => {
    setShowConfirmPopup(false);
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteCard({ id: deleteCard.id });
      if (!data.success) throw data.message;
      getCardsList();
      toast.success(data.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCardsList();
  }, []);

  return (
    <div className="">
      <ModalConfirmation
        heading="Are you sure?"
        subHeading="Are you sure to delete this card?"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        handleCallback={handleCardDelete}
      ></ModalConfirmation>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            <li class="db-view-bank-div-main db-view-bank-common-div db-view-bank-heading">
              <div class="bank-card-name-wrap"> Card Holder Name</div>
              <div class="bank-account-num-wrap">Credit Card Number</div>
              <div class="bank-account-date-wrap">Expiration Date</div>
              <div class="bank-del-wrap"> </div>
            </li>
            {cardsList && cardsList.length > 0 ? (
              cardsList.map((item, index) => (
                <CardItem
                  key={`${item.card_number}${index}`}
                  item={item}
                  handleDelete={handleConfirmDelete}
                />
              ))
            ) : (
              <p>Card Not Found</p>
            )}
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
