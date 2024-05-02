import React, { useContext, useEffect } from "react";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SystemOptionsContext } from "context/systemOptionsContext";
import { useState } from "react";

function OtpTypePopup(props) {
  const { setModalShow, handleCallBack } = props;
  const { setIsLoading } = useContext(LoaderContext);
  const { profile } = useSelector((state) => state.userProfile);
  const { cust_id = "", country_code = "", mobile_number = "" } = profile || {};
  const [systemOptions, setSystemOptions] = useState({});
  const {
    MOBILE_NUMBER_NOT_CHANGE_DURATION_IN_DAYS,
    CHANGE_MOBILE_NUMBER_ALLOW_COUNT,
  } = systemOptions;

  const getSystemOptions = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getAllSystemOptions();
      if (!data?.success) throw data?.message;
      setSystemOptions(data?.data || {});
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSystemOptions();
  }, []);

  const openOtpModal = async (type) => {
    setIsLoading(true);
    let values = {
      verify_number_flag: "old_number",
      verification_via: type,
      customer_id: cust_id,
      country_code: country_code,
      mobile_number: mobile_number,
    };
    try {
      const { data } = await apiRequest.createChangeMobileOtp(values);
      if (!data.success) throw data.message;
      if (data?.data?.otp) toast.success(data.data.otp);
      toast.success(data.message);
      setModalShow(false);
      await handleCallBack(values);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-dialog modal-dialog-centered w-100">
        <div className="modal-content">
          <div className="modal-header">
            <img
              src="/assets/images/otp_card.svg"
              alt=""
              className="ic-shadow"
            />
            <br />
            <h3>Receive otp on</h3>
          </div>
          <div className="modal-body">
            <div className="otp-option-wrap">
              <div
                className="email-option"
                onClick={() => openOtpModal("email")}
              >
                <div className="otp-option">
                  <img src="/assets/images/email-otp.svg" alt="" />
                  <p>Email</p>
                </div>
              </div>
              <div className="sms-option" onClick={() => openOtpModal("sms")}>
                <div className="otp-option">
                  <img src="/assets/images/mobile-otp.svg" alt="" />
                  <p>SMS</p>
                </div>
              </div>
            </div>
          </div>
          {CHANGE_MOBILE_NUMBER_ALLOW_COUNT &&
            MOBILE_NUMBER_NOT_CHANGE_DURATION_IN_DAYS && (
              <div>
                <p className="text-danger text-center mt-4">
                  {`Note: You can change your mobile number ${CHANGE_MOBILE_NUMBER_ALLOW_COUNT} times in ${MOBILE_NUMBER_NOT_CHANGE_DURATION_IN_DAYS} days`}
                </p>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default OtpTypePopup;
