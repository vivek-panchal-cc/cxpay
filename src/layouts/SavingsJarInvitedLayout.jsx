import React from "react";
import { Outlet } from "react-router";
import SavingJarInvitedProvider from "context/savingJarInvitedProvider";

const SavingsJarInvitedLayout = () => {
  return (
    <SavingJarInvitedProvider>
      <Outlet />
    </SavingJarInvitedProvider>
  );
};

export default SavingsJarInvitedLayout;
