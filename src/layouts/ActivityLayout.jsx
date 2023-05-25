import React from "react";
import ActivityProvider from "context/activityContext";
import { Outlet } from "react-router";
import SendPaymentProvider from "context/sendPaymentContext";

const ActivityLayout = () => {
  return <ActivityProvider>{<Outlet />}</ActivityProvider>;
};

export default ActivityLayout;
