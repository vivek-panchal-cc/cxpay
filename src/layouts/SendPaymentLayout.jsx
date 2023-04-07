import SendPaymentProvider from "context/sendPaymentContext";
import React from "react";
import { Outlet } from "react-router-dom";

function SendPaymentLayout() {
  return <SendPaymentProvider>{<Outlet />}</SendPaymentProvider>;
}

export default SendPaymentLayout;
