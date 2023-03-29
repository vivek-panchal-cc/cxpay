import React from "react";

function CardDetails(props) {
  const {
    billing_address,
    card_holder_first_name,
    card_holder_last_name,
    card_number,
    city,
    color,
    country,
    email,
    expiry_date,
    id,
    image,
    mark_as_default,
  } = props.card;
  return (
    <div className="wc-details-wrap">
      <div className="card-detail js-card-section d-block" id="cardId_0">
        <table>
          <tbody>
            <tr>
              {/* <td>Bank</td> */}
              {/* <td>MCB Bank</td> */}
            </tr>
            <tr>
              <td>Card Number</td>
              <td>
                <span>•••• •••• •••• {card_number}</span>
              </td>
            </tr>
            <tr>
              <td>Expiry Date</td>
              <td>{expiry_date}</td>
            </tr>
            <tr>
              <td>First Name</td>
              <td>{card_holder_first_name}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>{card_holder_last_name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CardDetails;
