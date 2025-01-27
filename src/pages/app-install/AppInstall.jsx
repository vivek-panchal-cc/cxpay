import { useEffect } from "react";
import useAppInstall from "hooks/useAppInstall";
import { useNavigate } from "react-router-dom";
import { storageRequest } from "helpers/storageRequests";

function AppInstall() {
  const navigate = useNavigate();
  const [appUrl] = useAppInstall();

  useEffect(() => {
    (() => {
      if (appUrl && typeof appUrl === "string") {
        window.open(appUrl, "_blank");
        storageRequest.removeAuth();
        navigate("/login", { replace: true });
      }
    })();
  }, [appUrl]);
}

export default AppInstall;
