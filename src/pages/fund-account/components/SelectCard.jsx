import React, { useContext, useEffect, useState } from "react";
import CreditCard from "components/cards/CreditCard";
import { FundContext } from "context/fundContext";
import { useSelector } from "react-redux";

function SelectCard() {
  const { cardsList } = useSelector((state) => state.userWallet);
  const [selectedCard, setSelectedCard] = useState({});
  const { formik, integrateCardDetails, handleSelectExistingCard } =
    useContext(FundContext);

  useEffect(() => {
    if (!formik || !formik.values.card_id || !cardsList) return;
    const card = cardsList.find((item) => item.id === formik.values.card_id);
    setSelectedCard(card);
  }, [formik]);

  const handleSelectFromExistingCard = (radioe, cardId) => {
    const checked = radioe.currentTarget.checked;
    if (!checked) return;
    const card = cardsList?.find((item) => item.id === cardId);
    setSelectedCard(card);
  };

  const handleProceed = () => {
    if (!selectedCard || !selectedCard.id) return;
    integrateCardDetails(selectedCard);
    handleSelectExistingCard(false);
  };

  return (
    <div className="">
      <div className="title-content-wrap send-pay-title-sec title-common-sec">
        <h3>View Cards</h3>
        <p>Choose a card</p>
      </div>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {cardsList && cardsList.length > 0 ? (
              cardsList.map((item, index) => (
                <CreditCard
                  key={`${item.card_number}${index}`}
                  index={`${item.card_number}${index}`}
                  item={item}
                  defaultText={"Selected"}
                  defaultSelected={item.id === selectedCard?.id}
                  handleDefaultCard={handleSelectFromExistingCard}
                />
              ))
            ) : (
              <p className="text-center">Card Not Found</p>
            )}
          </ul>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 p-0 btns-inline">
          <div className="setting-btn-link btn-wrap">
            <button className="outline-btn">Cancel</button>
          </div>
          <div className="btn-wrap">
            <button className={`btn btn-primary`} onClick={handleProceed}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectCard;
