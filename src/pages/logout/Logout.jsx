import { fetchLogout } from "features/user/userProfileSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // this function should be in a common folder
  useEffect(() => {
    (async () => {
      try {
        const { error, payload } = await dispatch(fetchLogout());
        if (error) throw payload;
        navigate("/login", { replace: true });
      } catch (error) {
        navigate("/login", { replace: true });
      }
    })();
  }, [dispatch]);

  return <></>;
}

export default Logout;
