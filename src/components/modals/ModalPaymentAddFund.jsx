import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoaderPaymentProcess from "loaders/LoaderPaymentProcess";
import { toast } from "react-toastify";
import styles from "./modal.module.scss";
import {
  fetchCheckEnrollment,
  fundPaymentCompleted,
  fundPaymentFailed,
  fundPaymentReset,
} from "features/payment/payAddFundSlice";
import {
  API_TRANSACTION_DATE_COLLECTED_ORIGIN,
  API_TRANSACTION_PAYMENT_RETURN_ORIGIN,
} from "constants/urls";
import { useLocation, useNavigate } from "react-router-dom";

const ModalPaymentAddFund = (props) => {
  const {
    id,
    className,
    classNameChild,
    onFundCompleted = () => {},
    onFundFailed = () => {},
  } = props;
  const modalRef = useRef(null);
  const modalBodyRef = useRef(null);
  const dataCollectFormRef = useRef(null);
  const dataCollectFrameRef = useRef(null);
  const dispatch = useDispatch();
  const {
    loadingPayment,
    transactionDetails,
    setupDeviceAuthDetails,
    enrollmentAuthDetails,
    paymentStatus,
    message,
  } = useSelector((state) => state.payAddFund);

  const location = useLocation();
  const navigate = useNavigate();

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
        onFundCompleted();
        dispatch(fundPaymentReset());
        break;
      case "FAILED":
        setLoading(false);
        setAppChildrens([]);
        toast.error(message);
        onFundFailed();
        dispatch(fundPaymentReset());
        break;
      default:
        break;
    }
  }, [paymentStatus, message]);

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
        ref: (ref) => (dataCollectFrameRef.current = ref),
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
      if (appChildrens.length > 2) {
        const muChild = [appChildrens[0], appChildrens[1], null, null];
        muChild[3] = iframe;
        muChild[4] = form;
        setAppChildrens(muChild);
      } else setAppChildrens((cs) => cs.concat([iframe, form]));
    }
  }, [enrollmentAuthDetails]);

  useEffect(() => {
    const handleEvent = (event) => {
      const { message, data, origin } = event;
      if (origin === API_TRANSACTION_DATE_COLLECTED_ORIGIN) {
        const { MessageType, SessionId, Status } = JSON.parse(data || "");
        dispatch(
          fetchCheckEnrollment({
            security_code: transactionDetails?.security_code || "",
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
      if (origin === API_TRANSACTION_PAYMENT_RETURN_ORIGIN) {
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
  }, []);

  useEffect(() => {
    if (dataCollectFormRef.current) {
      dataCollectFormRef.current.submit();
    }
  }, [appChildrens, appChildrens.length]);

  useEffect(() => {
    if (loadingPayment) setLoading(true);
  }, [loadingPayment]);

  useEffect(() => {
    const handlePopState = (event) => {
      window.removeEventListener("popstate", handlePopState);
      window.onpopstate = null;
      const conLeave = confirm("Do you want to leave this site?");
      if (conLeave) {
        dispatch(fundPaymentReset());
      } else {
        navigate(location.pathname);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      if (!loadingPayment)
        window.removeEventListener("popstate", handlePopState);
    };
  }, [loadingPayment]);

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
              className="modal-body d-flex justify-content-center flex-column position-relative"
              ref={modalBodyRef}
              style={{
                minHeight: "400px",
                width: "100%",
              }}
            >
              {appChildrens}
              {loading ? (
                <div
                  className="position-absolute z-2"
                  style={{
                    inset: "0",
                    background: "#ffffff",
                  }}
                >
                  <LoaderPaymentProcess message={message} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPaymentAddFund;
