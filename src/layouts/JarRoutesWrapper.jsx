import { Outlet } from "react-router-dom";
import SavingJarOwnProvider from "context/savingJarOwnProvider";
const JarRoutesWrapper = () => {
  return (
    <SavingJarOwnProvider>
      <Outlet />
    </SavingJarOwnProvider>
  );
};
export default JarRoutesWrapper;
