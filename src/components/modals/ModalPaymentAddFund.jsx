import React, { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckEnrollment,
  fundPaymentCompleted,
  fundPaymentFailed,
} from "features/payment/payAddFundSlice";
import LoaderPaymentProcess from "loaders/LoaderPaymentProcess";
import { toast } from "react-toastify";

const ModalPaymentAddFund = (props) => {
  const { id, className, classNameChild } = props;
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
    message,
  } = useSelector((state) => state.payAddFund);

  const [appChildrens, setAppChildrens] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        break;
      case "IN_WAITING":
        setLoading(false);
        toast.warning(message, { autoClose: 1000 });
        break;
      case "COMPLETED":
        setLoading(false);
        setAppChildrens([]);
        toast.success(message);
        break;
      case "FAILED":
        setLoading(false);
        setAppChildrens([]);
        toast.error(message);
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
    if (enrollmentStatus && enrollmentStatus === "PENDING_AUTHENTICATION") {
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
      const { data, origin } = event;
      if (origin === `http://14.194.129.238:5056`) {
        console.log(data);
        try {
          if (!data.success) throw data?.message;
          dispatch(fundPaymentCompleted({ message: data?.message }));
        } catch (error) {
          dispatch(fundPaymentFailed({ message: error }));
        }
      }
    };
    window.addEventListener("message", handleEvent, false);
    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, [enrollmentAuthDetails]);

  useEffect(() => {
    if (loadingPayment) setLoading(true);
  }, [loadingPayment]);

  useEffect(() => {
    const stepUpIframe = document.querySelector(
      "iframe[name='step-up-iframe']"
    );
    if (!stepUpIframe) return;
    stepUpIframe.addEventListener("load", () => {
      console.log("JSK");
    });
  }, [appChildrens]);

  if (!loadingPayment) return;
  return (
    <div
      id={id}
      role="dialog"
      className={`test modal fade show ${styles.modal} ${className}`}
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content px-0">
            <div className="modal-header flex-column pb-3">
              <h3 className="text-center">Processing Your Payment</h3>
            </div>
            <div
              className="modal-body d-flex justify-content-center flex-column"
              ref={modalBodyRef}
            >
              {appChildrens}
              {loading ? <LoaderPaymentProcess message={message} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaymentAddFund;
