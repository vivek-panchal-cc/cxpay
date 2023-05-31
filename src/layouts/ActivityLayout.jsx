import React from "react";
import ActivityProvider from "context/activityContext";
import { Outlet } from "react-router";

const ActivityLayout = () => {
  return <ActivityProvider>{<Outlet />}</ActivityProvider>;
};

export default ActivityLayout;
