import React from "react";
import { Outlet } from "react-router";
import SavingJarSharedProvider from "context/savingJarSharedProvider";

const SavingsJarSharedLayout = () => {
  return (
    <SavingJarSharedProvider>
      <Outlet />
    </SavingJarSharedProvider>
  );
};

export default SavingsJarSharedLayout;
