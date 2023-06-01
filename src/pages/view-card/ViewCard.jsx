import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoaderContext } from "context/loaderContext";
import { setEditCard } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardItem from "./component/CardItem";

function ViewCard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const [cardsList, setCardsList] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [deleteCard, setDeleteCard] = useState(null);
  const [popupError, setPopupError] = useState(""); // Error for popup

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

  // Getting confirmation before deleting card
  const handleConfirmDelete = (card) => {
    setPopupError("");
    setShowConfirmPopup(true);
    setDeleteCard(card);
  };

  // For Deleting card after confirmation
  const handleCardDelete = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteCard({ id: deleteCard.id });
      if (!data.success) throw data.message;
      setShowConfirmPopup(false);
      await getCardsList();
      toast.success(data.message);
    } catch (error) {
      setPopupError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardEdit = async (card) => {
    await dispatch(setEditCard(card));
    navigate("/wallet/view-card/edit-card");
  };

  const handleDefaultCard = async (radioe, cardId) => {
    const checked = radioe.currentTarget.checked;
    if (!checked) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.cardMarkAsDefault({ card_id: cardId });
      if (!data.success) throw data.message;
      await getCardsList();
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
      <div className="title-content-wrap send-pay-title-sec title-common-sec">
        <h3>View Cards</h3>
        <p>My Credit Cards</p>
      </div>
      <ModalConfirmation
        heading="Are you sure?"
        subHeading="Are you sure to delete this card?"
        error={popupError}
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        handleCallback={handleCardDelete}
      ></ModalConfirmation>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            <li className="db-view-bank-div-main db-view-bank-common-div db-view-bank-heading">
              <div className="bank-card-name-wrap"> Card Holder Name</div>
              <div className="bank-account-type-wrap">Primary Card</div>
              <div className="bank-account-num-wrap">Credit Card Number</div>
              <div className="bank-account-date-wrap">Expiration Date</div>
              <div className="bank-del-wrap"></div>
              <div className="bank-del-wrap"></div>
            </li>
            {cardsList && cardsList.length > 0 ? (
              cardsList.map((item, index) => (
                <CardItem
                  key={item?.card_number || index}
                  index={`${item.card_number}${index}`}
                  item={item}
                  handleEdit={handleCardEdit}
                  handleDelete={handleConfirmDelete}
                  handleDefaultCard={handleDefaultCard}
                />
              ))
            ) : (
              <p className="text-center">Card Not Found</p>
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
