import React from "react";
import { Outlet } from "react-router";
import RecurringPaymentProvider from "context/recurringPaymentContext";

const RecurringPaymentLayout = () => {
  return (
    <RecurringPaymentProvider>
      <Outlet />
    </RecurringPaymentProvider>
  );
};

export default RecurringPaymentLayout;
