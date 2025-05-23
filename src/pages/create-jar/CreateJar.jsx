import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import { replace, useFormik } from "formik";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { addJarSchema } from "schemas/jarSchema";
import InputIconSelect from "components/ui/InputIconSelect";
import {
  capitalizeWordByWord,
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
} from "constants/all";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import InputDatePicker from "components/ui/InputDatePicker";
import JarMemberListingModal from "components/modals/JarMemberListingModal";
import useJarIcons from "hooks/useJarIcons";
import useJarCategories from "hooks/useJarCategories";
import InputSelect from "components/ui/InputSelect";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import ModalJarPaymentSelect from "components/modals/ModalJarPaymentSelect";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";
import SubAccountsInputSelect from "components/ui/SubAccountsInputSelect";

const CreateJar = (props) => {
  const navigate = useNavigate();
  const [categoryParentId, setCategoryParentId] = useState("");
  const [jarIcon, jarIconLoading] = useJarIcons({
    category_id: categoryParentId,
  });
  const [jarCategory] = useJarCategories();
  const [datePicker, setDatePicker] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showModalScheduler, setShowModalScheduler] = useState(false);
  const [jarMembers, setJarMembers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const {
    handleCreatedJarData,
    cancelOwnJarPayment,
    handleSendJarSchedule,
    handleInstantPayment,
    handleRecurringPayment,
    createdJarData,
  } = useContext(SavingJarOwnContext);
  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck =
    isAdminApprovedWithRenewCheck(admin_approved, show_renew_section) !== false;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      jar_name: "",
      target_amount: "",
      target_date: "",
      jar_icon: null,
      members: [],
      jar_parent_category_id: "",
      jar_child_category_id: "",
      jar_child_category_name: "",
    },
    validationSchema: addJarSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      const formattedDate = formatDate(new Date(values.target_date)); // Ensure dd-mm-yyyy format
      let jarIconFilename = "";
      let jarIconUrl = "";
      const selectedIcon = jarIcon.find((icon) => icon.id === values.jar_icon);
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
      handleCreatedJarData(requestData);
      setShowAddMemberPopup(false);
      setShowPaymentModal(true);
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

  const showAddMemberPopupData = () => {
    setShowPaymentModal(false);
    setShowAddMemberPopup(true);
  };

  const cancelPayment = () => {
    setShowAddMemberPopup(false);
    setShowPaymentModal(false);
    if (cancelOwnJarPayment) cancelOwnJarPayment();
  };

  const handleGoBack = () => {
    navigate("/jars/own", { replace: true });
    if (cancelOwnJarPayment) cancelOwnJarPayment();
  };

  const handleSchedulePayment = () => {
    setShowPaymentModal(false);
    setShowModalScheduler(true);
  };

  const handleRemoveMember = (memberToRemove) => {
    const updatedMembers = jarMembers.filter(
      (member) => member.account_number !== memberToRemove.account_number
    );
    setJarMembers(updatedMembers); // Update state
    formik.setFieldValue(
      "members",
      updatedMembers.map((member) => member.account_number) // Extract only IDs
    );
  };

  useEffect(() => {
    if (!jarIcon.length) return;
    setCategoryParentId(formik.values.jar_parent_category_id);
    formik.setFieldValue("jar_icon", null);
  }, [formik.values.jar_parent_category_id, jarIcon]);

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  if (!adminApprovedWithRenewCheck) return <Navigate to="/jars/own" replace />;

  return (
    <div className="saving-jar-add-bottom">
      <div className="rm-pl-profile-info">
        <h3>Create Sub-account</h3>
        <ul className="breadcrumb">
          <li>
            <Link to="/jars/own">Sub-accounts</Link>
          </li>
          <li>Create Sub-account</li>
        </ul>
        <p className="mb-4">Please fill below details to create Sub-account</p>
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
              <SubAccountsInputSelect
                labelname=""
                className="form-select form-control"
                name="jar_parent_category_id"
                value={
                  formik.values.jar_child_category_id +
                  "|" +
                  formik.values.jar_parent_category_id
                }
                onChange={(selected) => {
                  const [childId, parentId] = selected.split("|");
                  const selectedParent = jarCategory.find(
                    (parent) => String(parent.id) === parentId
                  );

                  const selectedChild = selectedParent?.children?.find(
                    (child) => String(child.id) === childId
                  );

                  if (selectedParent && selectedChild) {
                    formik.setFieldValue("jar_parent_category_id", parentId);
                    formik.setFieldValue("jar_child_category_id", childId);
                    // If the selected child id is not 98765, clear the jar_child_category_name field
                    if (childId !== "98765") {
                      formik.setFieldValue("jar_child_category_name", "");
                    }
                  } else {
                    formik.setFieldValue("jar_parent_category_id", "");
                    formik.setFieldValue("jar_child_category_id", "");
                    formik.setFieldValue("jar_child_category_name", "");
                  }
                }}
                error={
                  formik.touched.jar_parent_category_id &&
                  formik.errors.jar_parent_category_id
                }
                options={jarCategory}
              />
              {/* <InputSelect
                className="form-select form-control"
                name="jar_parent_category_id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.jar_parent_category_id}
                error={
                  formik.touched.jar_parent_category_id &&
                  formik.errors.jar_parent_category_id
                }
              >
                <option value={""}>Select Category</option>
                {jarCategory?.map((jc) => (
                  <option key={jc.id} value={jc.id}>
                    {capitalizeWordByWord(jc.jar_category_name)}
                  </option>
                ))}
              </InputSelect> */}
            </div>
          </div>

          {formik.values.jar_child_category_id === "98765" && (
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Other"
                  name="jar_child_category_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.jar_child_category_name}
                  error={
                    formik.touched.jar_child_category_name &&
                    formik.errors.jar_child_category_name
                  }
                />
              </div>
            </div>
          )}

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
                        style={{
                          filter: "drop-shadow(0 0 0 black)",
                          objectFit: "contain",
                        }}
                      />
                      {/* Sub-account {icon.id} */}
                    </div>
                  ),
                  url: icon.url,
                }))}
                isLoading={jarIconLoading}
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

          {jarMembers?.length > 0 && (
            <div className="avatar-list">
              {jarMembers.map((member, index) => (
                <div
                  key={index}
                  className="avatar-item"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="act-user-thumb">
                    {/* {hoveredIndex === index && ( */}
                    <div
                      className="remove-icon"
                      onClick={() => handleRemoveMember(member)}
                    >
                      <a className="eg-close-btn" style={{ right: "11px" }}>
                        <img
                          src="/assets/images/cross-red.svg"
                          alt=""
                          style={{ width: "24px", height: "24px" }}
                        />
                      </a>
                    </div>
                    {/* )} */}
                    {member.member_profile_image ? (
                      <img
                        src={member.member_profile_image}
                        className="blue-bg"
                        alt=""
                      />
                    ) : (
                      <div
                        className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                          member.member_name
                        )}`}
                      >
                        {getInitials(member.member_name)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* <div className="add-contact-btn-wrap">
            <button
              type="button"
              onClick={showAddMemberPopupData}
              className="btn add-contact-btn w-100"
            >
              Add Sub-account Members
            </button>
          </div> */}

          {/* {formik.errors.members && formik.touched.members && (
            <div className="text-danger ps-2">{formik.errors.members}</div>
          )} */}

          <div className="row">
            <div className="col-12 p-0 btns-inline">
              <div className="setting-btn-link btn-wrap">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="outline-btn w-100 text-center d-block"
                >
                  Cancel
                </button>
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
      />

      <JarMemberListingModal
        id="delete-group-popup"
        show={showAddMemberPopup}
        setShow={setShowAddMemberPopup}
        handleCallback={() => setShowAddMemberPopup(false)}
        className={`con-list-pop`}
        jarId={""}
        selectedItem={(items) => formik.setFieldValue("members", items)}
        selectedFullItem={(item) => setJarMembers([...item])}
        selectedMembers={jarMembers}
      />

      <ModalJarPaymentSelect
        id="delete-group-popup"
        show={showPaymentModal}
        setShow={setShowPaymentModal}
        handleCallback={cancelPayment}
        className={`con-list-pop`}
        handleSchedulePayment={handleSchedulePayment}
        handleInstantPayment={handleInstantPayment}
        handleRecurringPayment={handleRecurringPayment}
      />

      <ModalPaymentScheduler
        classNameChild="schedule-time-modal"
        show={showModalScheduler}
        setShow={setShowModalScheduler}
        handleSubmit={handleSendJarSchedule}
        data={createdJarData}
      />
    </div>
  );
};

export default CreateJar;
