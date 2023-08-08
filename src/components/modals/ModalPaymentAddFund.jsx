import React, { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchCheckEnrollment } from "features/payment/payAddFundSlice";

const ModalPaymentAddFund = (props) => {
  const { id, className, classNameChild } = props;
  const [appChildrens, setAppChildrens] = useState([]);
  const modalRef = useRef(null);
  const modalBodyRef = useRef(null);
  const dataCollectFormRef = useRef(null);
  const dispatch = useDispatch();
  const {
    loadingPayment,
    transactionDetails,
    setupDeviceAuthDetails,
    enrollmentAuthDetails,
    paymentStatus,
    error,
    errorMessage,
  } = useSelector((state) => state.payAddFund);

  const {
    transactionId,
    referenceId,
    accessToken: accessTokenSetup,
    deviceDataCollectionUrl,
  } = setupDeviceAuthDetails || {};

  const {
    status: enrollmentStatus,
    accessToken: accessTokenEnroll,
    stepUpURL,
  } = enrollmentAuthDetails || {};

  useEffect(() => {
    if (!paymentStatus) return;
    switch (paymentStatus) {
      case "IN_PROGRESS":
        break;
      case "COMPLETED":
        break;
      case "FAILED":
        break;
      default:
        break;
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (accessTokenSetup && deviceDataCollectionUrl) {
      const iframe = React.createElement("iframe", {
        name: "collectionIframe",
        height: "10",
        width: "10",
      });
      const input = React.createElement("input", {
        id: "cardinal_collection_form_input",
        type: "hidden",
        name: "JWT",
        value: accessTokenSetup,
        key: "0",
      });
      const form = React.createElement("form", {
        id: "cardinal_collection_form",
        method: "POST",
        target: "collectionIframe",
        action: deviceDataCollectionUrl,
        children: input,
        ref: (ref) => (dataCollectFormRef.current = ref),
        key: "1",
      });
      setAppChildrens([iframe, form]);
    }
  }, [setupDeviceAuthDetails]);

  useEffect(() => {
    switch (enrollmentStatus) {
      case "AUTHORIZED":
        return;
      case "PENDING_AUTHENTICATION":
        const iframe = React.createElement("iframe", {
          name: "step-up-iframe",
          height: "400",
          width: "100%",
        });
        const inputJwt = React.createElement("input", {
          type: "hidden",
          name: "JWT",
          value: accessTokenEnroll,
        });
        const inputMd = React.createElement("input", {
          type: "hidden",
          name: "MD",
          value: referenceId,
        });
        const form = React.createElement("form", {
          id: "step-up-form",
          target: "step-up-iframe",
          method: "post",
          action: stepUpURL,
          ref: (ref) => (dataCollectFormRef.current = ref),
          children: [inputJwt, inputMd],
        });
        setAppChildrens((cs) => cs.concat([iframe, form]));
        return;
      case "AUTHENTICATION_FAILED":
        return;
    }
  }, [enrollmentAuthDetails]);

  useEffect(() => {
    if (dataCollectFormRef.current) {
      dataCollectFormRef.current.submit();
    }
  }, [appChildrens, appChildrens.length]);

  useEffect(() => {
    const handleEvent = (event) => {
      const { message, data, origin } = event;
      if (origin === "https://centinelapistag.cardinalcommerce.com") {
        const { MessageType, SessionId, Status } = JSON.parse(data || "");
        dispatch(
          fetchCheckEnrollment({
            status: Status,
            referenceId,
          })
        );
      }
    };
    window.addEventListener("message", handleEvent, false);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, [setupDeviceAuthDetails]);

  useEffect(() => {
    const handleEvent = (event) => {
      const { message, data, origin } = event;
      if (origin === `http://14.194.129.238:5056`) {
        // const result = JSON.parse(data || "");
        console.log("JSSSSSSSKKKKKKKKKKK", data);
      }
    };
    window.addEventListener("message", handleEvent, false);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, [enrollmentAuthDetails]);

  if (!loadingPayment) return;
  return (
    <div
      id={id}
      role="dialog"
      className={`test modal fade show ${styles.modal} ${className}`}
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">Processing Your Payment</h3>
            </div>
            <div
              className="modal-body d-flex justify-content-center pb-5"
              ref={modalBodyRef}
            >
              {appChildrens}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaymentAddFund;
