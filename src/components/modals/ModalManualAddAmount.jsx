import Input from "components/ui/Input";
import React, { useEffect, useRef, useState } from "react";
import styles from "./modal.module.scss";
import { CURRENCY_SYMBOL } from "constants/all";
import { setAmount } from "schemas/jarSchema"; // Yup schema

function ModalManualAddAmount(props) {
  const {
    children,
    className,
    classNameChild,
    id,
    show,
    setShow,
    handleCallback,
    heading = "Confirm",
    subHeading = "",
    error = "",
    allowClickOutSide,
  } = props;

  const modalRef = useRef(null);
  const [amount, setAmountValue] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target)) {
        !allowClickOutSide && setShow && setShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setShow, allowClickOutSide]);

  useEffect(() => {
    if (!show) {
      setAmountValue("");
      setInputError("");
    }
  }, [show]);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");

    // Prevent more than one decimal point
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.slice(0, -1);
    }

    const [integerPart = "", decimalPart = ""] = value.split(".");
    if (integerPart.length <= 6) {
      if (decimalPart.length > 2) {
        setAmountValue(`${integerPart}.${decimalPart.slice(0, 2)}`);
      } else {
        setAmountValue(value);
      }
    } else {
      setAmountValue(
        `${integerPart.slice(0, 6)}${
          decimalPart ? `.${decimalPart.slice(0, 2)}` : ""
        }`
      );
    }
  };

  const handleSubmit = async () => {
    try {
      await setAmount.validate({ amount });
      let formattedValue = amount;

      if (!formattedValue.includes(".")) {
        formattedValue += ".00";
      } else {
        const [integerPart, decimalPart] = formattedValue.split(".");
        if (decimalPart.length === 1) {
          formattedValue = `${integerPart}.${decimalPart}0`;
        }
      }

      setInputError("");
      handleCallback(formattedValue);
    } catch (validationError) {
      setInputError(validationError.message);
    }
  };

  if (!show) return null;

  return (
    <div
      className={`modal fade show ${styles.modal} ${className} del-modal-main`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered justify-content-center">
          <div className="modal-content" style={{ width: "90%" }}>
            <div className="modal-header flex-column">
              <h3 className="text-center">{heading}</h3>
              <p>{subHeading}</p>
            </div>
            <div>
              <div>{children}</div>
              <div className="d-flex justify-content-center">
                <form>
                  <div className="input-select-wrap form-field">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="0.00"
                      name="amount"
                      autoFocus
                      autoComplete="off"
                      onChange={handleInputChange}
                      value={amount}
                      error={inputError || error}
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <p className="ip_currancy">{CURRENCY_SYMBOL}</p>
                  </div>

                  {/* {(inputError || error) && (
                    <p className="text-danger text-center">
                      {inputError || error}
                    </p>
                  )} */}

                  <div className="popup-btn-wrap d-flex align-items-center justify-content-end gap-4 mt-3">
                    <div className="set-amount">
                      <button
                        type="button"
                        className="outline-btn px-4"
                        style={{ minWidth: "initial" }}
                        onClick={() => setShow(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`outline-btn px-4 py-3 ${
                          amount.length === 0 || amount <= 0
                            ? "disabled-font-color"
                            : ""
                        }`}
                        style={{ minWidth: "initial" }}
                        onClick={handleSubmit}
                        disabled={amount.length === 0 || amount <= 0}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalManualAddAmount;
