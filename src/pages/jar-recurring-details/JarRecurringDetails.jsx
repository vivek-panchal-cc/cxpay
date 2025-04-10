import React, { useContext, useEffect, useState } from "react";
import SectionButtons from "./components/SectionButtons";
import SectionHeader from "./components/SectionHeader";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import SectionRecurringDetails from "./components/SectionRecurringDetails";
import { apiRequest } from "helpers/apiRequests";
import SectionRecurringDates from "./components/SectionRecurringDates";
import SectionRecurringGroupList from "./components/SectionRecurringGroupList";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { toast } from "react-toastify";

const JarRecurringDetails = () => {
  const { recurringPaymentDetailsId } = useContext(SavingJarOwnContext);
  const [jarRecurringDetails, setJarRecurringDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchJarRecurringPaymentDetails = async () => {
      try {
        const { data } = await apiRequest.dateListSavingJarRecurringPayment({
          jar_recurring_payment_id: recurringPaymentDetailsId,
        });
        if (!data.success) throw data.message;
        setJarRecurringDetails(data?.data);
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJarRecurringPaymentDetails();
  }, [recurringPaymentDetailsId]);

  if (!recurringPaymentDetailsId) return <Navigate to="/jars/own" replace />;

  return (
    <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
      <div className="wr-title-wrap">
        <h3>Sub-account Recurring Payment Details</h3>
        <ul className="breadcrumb">
          <li>
            <Link to={`/jars/own/jar-recurring-pay-list`}>Sub-accounts</Link>
          </li>
          <li>Recurring Payment Details</li>
        </ul>
      </div>
      <div className="jar-rc-refund-all-wrap">
        <div className="jar-rc-refund-main-wrap">
          <div className="pattern-wrap"></div>
          <div className="rc-refund-main-inner">
            <SectionHeader details={jarRecurringDetails} loading={isLoading} />
            <div className="rcr-divider-wrap"></div>
            <SectionRecurringDetails
              details={jarRecurringDetails}
              loading={isLoading}
            />
            {/* <div className="rcr-divider-wrap"></div> */}
          </div>
          {/* <div className="pattern-wrap pattern-wrap-bottom"></div> */}
        </div>
        <div className="jar-rc-refund-second-wrap">
          <div></div>
          <div className="rc-refund-main-inner section-recurring-dates">
            <SectionRecurringDates
              details={jarRecurringDetails}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
      <SectionButtons
        handleBack={() => navigate(`/jars/own/jar-recurring-pay-list`)}
      />
    </div>
  );
};

export default JarRecurringDetails;
