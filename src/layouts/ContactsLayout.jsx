import ContatcsProvider from "context/contatcsContext";
import SendPaymentProvider from "context/sendPaymentContext";
import React from "react";
import { Outlet } from "react-router";

const ContactsLayout = () => {
  return (
    <ContatcsProvider>
      <SendPaymentProvider>{<Outlet />}</SendPaymentProvider>
    </ContatcsProvider>
  );
};

export default ContactsLayout;
