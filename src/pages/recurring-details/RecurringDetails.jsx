import React, { useEffect, useState } from "react";
import SectionButtons from "./components/SectionButtons";
import SectionHeader from "./components/SectionHeader";
import { useNavigate, useParams } from "react-router-dom";
import SectionRecurringDetails from "./components/SectionRecurringDetails";
import { apiRequest } from "helpers/apiRequests";
import SectionRecurringDates from "./components/SectionRecurringDates";
import SectionRecurringGroupList from "./components/SectionRecurringGroupList";

const RecurringDetails = () => {
  const [recurringDetails, setRecurringDetails] = useState(null);  
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params || {};

  const handleBack = () => {
    navigate(`/view-recurring-payment`);
  };

  useEffect(() => {
    const fetchRecurringPaymentDetails = async () => {
      try {
        const { data } = await apiRequest.viewRecurringPayment({
          recurring_payment_id: id,
        });
        setRecurringDetails(data?.data);
      } catch (error) {
        console.error("Error fetching recurring payment details:", error);
      }
    };

    fetchRecurringPaymentDetails();
  }, [id]);

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <div className="wr-title-wrap">
        <h2>Recurring Payment Details</h2>
      </div>
      <div className="rc-refund-all-wrap">
        <div className="rc-refund-main-wrap">
          <div className="pattern-wrap"></div>
          <div className="rc-refund-main-inner">
            <SectionHeader details={recurringDetails} />
            <div className="rcr-divider-wrap"></div>
            <SectionRecurringDetails details={recurringDetails} />
            {/* <div className="rcr-divider-wrap"></div> */}
          </div>
          {/* <div className="pattern-wrap pattern-wrap-bottom"></div> */}
        </div>
        {recurringDetails?.is_group === "0" && (
          <div className="rc-refund-second-wrap">
            <div>
            </div>
            <div className="rc-refund-main-inner section-recurring-dates">
              <SectionRecurringDates details={recurringDetails} />
            </div>
          </div>
        )}
      </div>
      {recurringDetails?.is_group === "1" && (
        <div className="rc-refund-group-wrap">
          <div className="rc-refund-group-inner">
            <SectionRecurringGroupList details={recurringDetails} />
          </div>
        </div>
      )}
      <SectionButtons handleBack={handleBack} />
    </div>
  );
};

export default RecurringDetails;
