import ContactsProvider from "context/contactsContext";
import SendPaymentProvider from "context/sendPaymentContext";
import React from "react";
import { Outlet } from "react-router";

const ContactsLayout = () => {
  return (
    <ContactsProvider>
      <SendPaymentProvider>{<Outlet />}</SendPaymentProvider>
    </ContactsProvider>
  );
};

export default ContactsLayout;
