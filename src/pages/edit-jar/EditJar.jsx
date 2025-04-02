import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { editJarSchema } from "schemas/jarSchema";
import InputIconSelect from "components/ui/InputIconSelect";
import {
  capitalizeWordByWord,
  CURRENCY_SYMBOL,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import InputDatePicker from "components/ui/InputDatePicker";
import useJarIcons from "hooks/useJarIcons";
import useJarCategories from "hooks/useJarCategories";
import InputSelect from "components/ui/InputSelect";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

const EditJar = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.userProfile);
  const { admin_approved } = profile || {};
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const [jarIcon, jarIconLoading] = useJarIcons();
  const [jarCategory] = useJarCategories();
  const [datePicker, setDatePicker] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const { cancelOwnJarPayment, editJar, prevPathRedirect, handleStoreJarId } =
    useContext(SavingJarOwnContext);
  const { editWallet } = editJar || [];
  const {
    jar_id,
    jar_name,
    target_date,
    target_amount,
    jar_category_id,
    jar_category_name,
    jar_icon,
    jar_icon_id,
  } = editWallet;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      jar_id: jar_id,
      jar_name: jar_name || "",
      target_amount: target_amount || "",
      target_date: target_date || "",
      jar_category_id: jar_category_id || "",
      jar_icon: jar_icon_id || null,
    },
    validationSchema: editJarSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const formattedDate = formatDate(new Date(values.target_date)); // Ensure dd-mm-yyyy format
        let jarIconFilename = "";
        let jarIconUrl = "";
        const selectedIcon = jarIcon.find(
          (icon) => icon.id === values.jar_icon
        );
        if (selectedIcon) {
          jarIconFilename = selectedIcon.icon_name;
          jarIconUrl = selectedIcon.url;
        }
        const requestData = {
          ...values,
          target_date: formattedDate,
          jar_icon: jarIconFilename || values.jar_icon,
          jar_url: jarIconUrl,
        };
        const { data } = await apiRequest.updateSavingJarDetails(requestData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        if (cancelOwnJarPayment) cancelOwnJarPayment();
        await handleStoreJarId(jar_id);
        navigate(`/jars/own/jar-details`, { replace: true });
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formatDate = (dateObj) => {
    if (dateObj instanceof Date) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return null;
  };

  const handleChangeDateFilter = (date) => {
    if (datePicker) {
      formik.setFieldValue("target_date", date);
      // setStartDate(formattedDate);
    }
    setDatePicker("");
  };

  const handleGoBack = async () => {
    if (cancelOwnJarPayment) await cancelOwnJarPayment();
    await handleStoreJarId(jar_id);
    navigate(`/jars/own/jar-details`);
  };

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  useEffect(() => {
    if (!editJar?.editWallet || editJar.editWallet.length <= 0) {
      navigate(prevPathRedirect || "/jars/own", { replace: true });
    }
  }, [editJar, navigate, prevPathRedirect]);

  return (
    <div className="saving-jar-add-bottom">
      <div className="rm-pl-profile-info">
        <h3>Update Sub-account</h3>
        <ul className="breadcrumb">
          <li>
            <span className="cursor-pointer" onClick={handleGoBack}>
              Sub-accounts
            </span>
          </li>
          <li>Edit Sub-account</li>
        </ul>
        <p className="mb-4">Please fill below details to update Sub-account</p>
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
                placeholder="Sub-account Name"
                name="jar_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.jar_name}
                error={formik.touched.jar_name && formik.errors.jar_name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-0 amt-with-currency">
              <span>{CURRENCY_SYMBOL}</span>
              <Input
                id="target_amount"
                type="text"
                inputMode="decimal"
                className="form-control"
                name="target_amount"
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
                        "target_amount",
                        integerPart + "." + decimalPart.slice(0, 2)
                      );
                    } else {
                      formik.setFieldValue("target_amount", value);
                    }
                  } else {
                    formik.setFieldValue(
                      "target_amount",
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

                  formik.setFieldValue("target_amount", value);
                  formik.handleBlur(e);
                }}
                value={formik.values.target_amount}
                error={
                  formik.touched.target_amount && formik.errors.target_amount
                }
              />
            </div>
          </div>
          <div className="common-dr-picker">
            <InputDatePicker
              className="d-flex flex-column form-field kyc-date-filter"
              date={formik.values.target_date}
              onClick={() => setDatePicker(true)}
              placeholder="Target Date"
            />
            {formik.touched.target_date && formik.errors.target_date ? (
              <p style={{ marginLeft: "10px" }} className="kyc-text-danger">
                {formik.errors.target_date}
              </p>
            ) : null}
          </div>
          <div className="row">
            <div className="col-12 p-0">
              <InputSelect
                className="form-select form-control"
                name="jar_category_id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.jar_category_id}
                error={
                  formik.touched.jar_category_id &&
                  formik.errors.jar_category_id
                }
              >
                <option value={""}>Select Category</option>
                {jarCategory?.map((jc) => (
                  <option key={jc.id} value={jc.id}>
                    {capitalizeWordByWord(jc.jar_category_name)}
                  </option>
                ))}
              </InputSelect>
            </div>
          </div>

          <div className="row">
            <div className="col-12 p-0">
              <InputIconSelect
                classNamePrefix="jar-icon-input"
                name="jar_icon"
                useReactSelect={true} // Enable react-select
                placeholder="Sub-account Category Icon"
                options={jarIcon.map((icon) => ({
                  value: icon.id,
                  label: (
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={icon.url}
                        alt={`Sub-account ${icon.id}`}
                        width="30"
                        height="30"
                        className="mb-1"
                      />
                      {/* Sub-account {icon.id} */}
                    </div>
                  ),
                  url: icon.url,
                }))}
                onChange={(selectedOption) =>
                  formik.setFieldValue("jar_icon", selectedOption.value)
                }
                onBlur={formik.handleBlur}
                value={
                  jarIcon.find((icon) => icon.id === formik.values.jar_icon) ||
                  null
                }
                error={formik.touched.jar_icon && formik.errors.jar_icon}
              />
            </div>
          </div>

          {adminApprovedWithRenewCheck ? (
            <div className="row">
              <div className="col-12 p-0 btns-inline">
                <div className="setting-btn-link btn-wrap">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className={`outline-btn w-100 text-center d-block ${
                      jarIconLoading ? "cursor-not-allowed" : ""
                    }`}
                    disabled={jarIconLoading}
                  >
                    Cancel
                  </button>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      jarIconLoading ? "cursor-not-allowed" : ""
                    }`}
                    value="Update"
                    disabled={formik.isSubmitting || jarIconLoading}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </div>
      <ModalDatePickerKyc
        minDate={datePicker ? new Date() : ""}
        show={datePicker}
        setShow={() => setDatePicker(false)}
        classNameChild={"schedule-time-modal"}
        heading="Target Date"
        handleChangeDate={handleChangeDateFilter}
      />
    </div>
  );
};

export default EditJar;
