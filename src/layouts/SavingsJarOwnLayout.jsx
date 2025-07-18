import React from "react";
import { Outlet } from "react-router";
import SavingJarOwnProvider from "context/savingJarOwnProvider";

const SavingsJarOwnLayout = () => {
  return (
    <SavingJarOwnProvider>
      <Outlet />
    </SavingJarOwnProvider>
  );
};

export default SavingsJarOwnLayout;
