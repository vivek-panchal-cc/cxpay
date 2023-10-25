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
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params || {};

  const handleBack = () => {
    navigate(`/view-recurring-payment`);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchRecurringPaymentDetails = async () => {
      try {
        const { data } = await apiRequest.viewRecurringPayment({
          recurring_payment_id: id,
        });
        setRecurringDetails(data?.data);
      } catch (error) {
        console.error("Error fetching recurring payment details:", error);
      } finally {
        setIsLoading(false);
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
            <SectionHeader details={recurringDetails} loading={isLoading} />
            <div className="rcr-divider-wrap"></div>
            <SectionRecurringDetails
              details={recurringDetails}
              loading={isLoading}
            />
            {/* <div className="rcr-divider-wrap"></div> */}
          </div>
          {/* <div className="pattern-wrap pattern-wrap-bottom"></div> */}
        </div>
        <div className="rc-refund-second-wrap">
          <div></div>
          <div className="rc-refund-main-inner section-recurring-dates">
            <SectionRecurringDates
              details={recurringDetails}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
      {recurringDetails?.is_group === "1" && (
        <div className="rc-refund-group-wrap">
          <div className="rc-refund-group-inner">
            <SectionRecurringGroupList
              details={recurringDetails}
              loading={isLoading}
            />
          </div>
        </div>
      )}
      <SectionButtons handleBack={handleBack} />
    </div>
  );
};

export default RecurringDetails;
