import { fetchLogout } from "features/user/userProfileSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function Logout() {
  const dispatch = useDispatch();

  // this function should be in a common folder
  useEffect(() => {
    (async () => {
      await dispatch(fetchLogout());
    })();
  }, [dispatch]);

  return <></>;
}

export default Logout;
