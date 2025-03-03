import React, { useEffect, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { linkBankSchema } from "schemas/walletSchema";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { useSelector } from "react-redux";
import useCountryBanks from "hooks/useCountryBanks";
import { CURRENCY_SYMBOL } from "constants/all";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import InputDatePicker from "components/ui/InputDatePicker";
import JarMemberListingModal from "components/modals/JarMemberListingModal";
import useJarIcons from "hooks/useJarIcons";

const CreateJar = (props) => {
  const navigate = useNavigate();
  const [jarIcon] = useJarIcons();
  const [banksList] = useCountryBanks();
  const [datePicker, setDatePicker] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

  const { profile } = useSelector((state) => state.userProfile);
  const { first_name, last_name, email, address, city, country } =
    profile || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      account_type: "current",
      bank_name: "",
      // swift_code: "",
      bank_number: "",
      bank_holder_first_name: first_name || "",
      bank_holder_last_name: last_name || "",
      email: email || "",
      address: address || "",
      country: country || "",
      city: city || "",
    },
    validationSchema: linkBankSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.linkBank(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/wallet/bank-list");
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          bank_name: error.bank_name?.[0],
          // swift_code: error.swift_code?.[0],
          bank_number: error.bank_number?.[0],
          bank_holder_first_name: error.bank_holder_first_name?.[0],
          bank_holder_last_name: error.bank_holder_last_name?.[0],
          email: error?.email?.[0],
          address: error?.address?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
        });
        setStatus(error);
      }
    },
  });

  const formatDate = (dateObj) => {
    if (dateObj instanceof Date) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const handleChangeDateFilter = (date) => {
    if (datePicker) {
      const formattedDate = formatDate(date);
      formik.setFieldValue("expiry_date", formattedDate);
      // setStartDate(formattedDate);
    }
    setDatePicker("");
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  useEffect(() => {
    const type = formik.values.account_type;
    formik.resetForm();
    formik.setFieldValue("account_type", type);
  }, [formik.values.account_type]);

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  return (
    <div>
      <div className="saving-jar-add-bottom">
        <div className="rm-pl-profile-info">
          <h3>Create Jar</h3>
          <ul className="breadcrumb">
            <Breadcrumb skipIndexes={[1]} />
          </ul>
          <p className="mb-4">Please fill below details to create Jar</p>
        </div>
        <div className="wallet-bank_link-form-wrap">
          <form
            id="form_saving_acc_op"
            className="wallet_acc_form"
            onSubmit={formik.handleSubmit}
          >
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Account Number"
                  name="bank_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bank_number}
                  error={
                    formik.touched.bank_number && formik.errors.bank_number
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-0 amt-with-currency">
                <span>{CURRENCY_SYMBOL}</span>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  name="amount"
                  // maxLength="6"
                  placeholder="Target Amount"
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimals

                    // Prevent more than one decimal point
                    const decimalCount = (value.match(/\./g) || []).length;
                    if (decimalCount > 1) {
                      value = value.slice(0, -1); // Remove extra decimal point
                    }

                    // Allow only up to 6 digits before the decimal point
                    const [integerPart, decimalPart] = value.split(".");
                    if (integerPart.length <= 6) {
                      if (decimalPart && decimalPart.length > 2) {
                        // Limit to two decimal places
                        formik.setFieldValue(
                          "amount",
                          integerPart + "." + decimalPart.slice(0, 2)
                        );
                      } else {
                        formik.setFieldValue("amount", value);
                      }
                    } else {
                      formik.setFieldValue(
                        "amount",
                        integerPart.slice(0, 6) +
                          (decimalPart ? `.${decimalPart.slice(0, 2)}` : "")
                      );
                    }
                  }}
                  onBlur={(e) => {
                    let value = e.target.value.trim();

                    if (!value || value === ".") {
                      value = "0.00"; // If the field is empty or just a '.', set it to "0.00"
                    } else {
                      const hasDecimal = value.includes(".");
                      // If there's no decimal point, add ".00"
                      if (!hasDecimal) {
                        value += ".00";
                      } else {
                        const parts = value.split(".");
                        if (parts[1].length === 0) {
                          value += "00"; // Add two zeroes if there are no decimal digits
                        } else if (parts[1].length === 1) {
                          value += "0"; // Add one zero if there's only one decimal digit
                        } else if (parts[1].length > 2) {
                          value = `${parts[0]}.${parts[1].slice(0, 2)}`; // Limit to two decimal places
                        }
                      }
                    }

                    formik.setFieldValue("amount", value);
                    formik.handleBlur(e);
                  }}
                  value={formik.values.amount}
                  error={formik.touched.amount && formik.errors.amount}
                />
              </div>
            </div>
            <div className="common-dr-picker">
              <InputDatePicker
                className="d-flex flex-column form-field kyc-date-filter"
                date={formik.values.expiry_date}
                onClick={() => setDatePicker(true)}
                placeholder="Target Date"
              />
              {formik.touched.expiry_date && formik.errors.expiry_date ? (
                <p style={{ marginLeft: "10px" }} className="kyc-text-danger">
                  {formik.errors.expiry_date}
                </p>
              ) : null}
            </div>

            <div className="row">
              <div className="col-12 p-0">
                <InputSelect
                  className="form-select form-control"
                  name="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                >
                  <option value={""}>Jar Category</option>
                  {jarIcon.map((icon) => (
                    <option key={icon.id} value={icon.url}>
                      Jar {icon.id}
                    </option>
                  ))}
                </InputSelect>
              </div>
            </div>

            <div className="add-contact-btn-wrap">
              <button
                onClick={() => showAddMemberPopupData()}
                className="btn add-contact-btn w-100"
              >
                Add Jar Members
              </button>
            </div>

            <div className="row">
              <div className="col-12 p-0 btns-inline">
                <div className="setting-btn-link btn-wrap">
                  <Link
                    to="/jars/own"
                    className="outline-btn w-100 text-center d-block"
                    replace
                  >
                    Cancel
                  </Link>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Continue"
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <ModalDatePickerKyc
          minDate={datePicker ? new Date() : ""}
          show={datePicker}
          setShow={() => setDatePicker(false)}
          classNameChild={"schedule-time-modal"}
          heading="Target Date"
          handleChangeDate={handleChangeDateFilter}
        ></ModalDatePickerKyc>

        <JarMemberListingModal
          id="delete-group-popup"
          show={showAddMemberPopup}
          setShow={setShowAddMemberPopup}
          handleCallback={() => setShowAddMemberPopup(false)}
          className={`con-list-pop`}
          // groupId={groupId}
          selectedItem={(item) => selectedItems(item)}
          // alldata={contactsList}
          selectedFullItem={(item) => setData([...contactsList, ...item])}
          // getItem={getItem}
        ></JarMemberListingModal>
      </div>
    </div>
  );
};

export default CreateJar;
