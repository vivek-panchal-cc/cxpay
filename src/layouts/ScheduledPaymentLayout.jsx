import React from "react";
import { Outlet } from "react-router";
import ScheduledPaymentProvider from "context/scheduledPaymentContext";

const ScheduledPaymentLayout = () => {
  return (
    <ScheduledPaymentProvider>
      <Outlet />
    </ScheduledPaymentProvider>
  );
};

export default ScheduledPaymentLayout;
