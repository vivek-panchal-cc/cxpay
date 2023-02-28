import Modal from "components/modals/Modal";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import React, { useState } from "react";
import { addCardSchema } from "schemas/walletSchema";
import CreditCard from "./components/CreditCard";
import CropCard from "./components/CropCard";
import CustomizePalette from "./components/CustomizePalette";
import UploadImage from "./components/UploadImage";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { IconCalender, IconLeftArrow } from "styles/svgs";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

function AddCard() {
  const [showPopupUpload, setShowPopupUpload] = useState(false);
  const [showPopupCrop, setShowPopupCrop] = useState(false);
  const [cardBgColor, setCardBgColor] = useState("blue");
  const [cardBackImg, setCardBackImg] = useState("");
  const [croppedImg, setCroppedImg] = useState("");
  const [expDate, setExpDate] = useState();

  const handleCustomizePalette = (color) => {
    setCardBgColor(color);
    if (color === "white") setShowPopupUpload(true);
  };

  const handleUploadImage = (img) => {
    setCardBackImg(img);
    setShowPopupCrop(true);
  };

  const handleCropImage = (cimg) => {
    setCroppedImg(cimg);
    setShowPopupUpload(false);
    setShowPopupCrop(false);
  };

  const handleRemoveImage = () => {
    setCroppedImg("");
  };

  const handleClosePopupUpload = () => setShowPopupUpload(false);

  const handleClosePopupCrop = () => setShowPopupCrop(false);

  const formik = useFormik({
    initialValues: {
      card_number: "",
      expiry_date: "", // mm-yyyy
      billing_address: "",
      security_code: "",
      color: cardBgColor,
    },
    validationSchema: addCardSchema,
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      try {
        const formData = new FormData();
        for (let key in values) formData.append(key, values[key]);
        if (croppedImg) formData.append("image", croppedImg);
        const { data } = await apiRequest.addCard(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        resetForm();
        setExpDate(new Date());
      } catch (error) {
        resetForm();
        toast.error(error);
        setExpDate(new Date());
      }
    },
  });

  return (
    <div className="wallet-add-card-main wallet-page-body">
      <Modal
        id="customize_card"
        className="customize-card-model wallet-pg-model"
        show={showPopupUpload}
        setShow={setShowPopupUpload}
      >
        <UploadImage
          handleUpload={handleUploadImage}
          closeModal={handleClosePopupUpload}
        />
      </Modal>
      <Modal
        id="crop_image_model"
        className="customize-card-model wallet-pg-model"
        show={showPopupCrop}
        setShow={setShowPopupCrop}
      >
        <CropCard
          src={cardBackImg}
          onImgCropped={handleCropImage}
          closeModal={handleClosePopupCrop}
        />
      </Modal>
      <div className="add-card-right-sec py-0">
        <div className="settings-inner-sec wallet-ac-is">
          <div className="profile-info">
            <h3>Add a Card</h3>
            <ul className="breadcrumb">
              <li>
                <a href="/">Wallet</a>
              </li>
              <li>Add a Card</li>
            </ul>
          </div>
          <div className="row wac-details-wrap">
            <div className="p-0 col-lg-7 col-12 wallet-ac-info-wrap z-0">
              <CreditCard
                bgcolor={cardBgColor}
                bgimg={croppedImg}
                cardNumber={
                  formik.touched.card_number && !formik.errors.card_number
                    ? formik.values.card_number
                    : null
                }
                expDate={
                  !formik.errors.expiry_date ? formik.values.expiry_date : null
                }
              />
            </div>
            <div className="p-0 col-lg-5 col-12">
              <CustomizePalette
                color={cardBgColor}
                bgimg={croppedImg}
                removeBgImg={handleRemoveImage}
                handleChange={handleCustomizePalette}
              />
            </div>
          </div>
          <div className="add-wallet-card-form-wrap">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-12 col p-0">
                  <div className="form-field">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Credit Card Number"
                      name="card_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.card_number}
                      error={
                        formik.touched.card_number && formik.errors.card_number
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 col-12 col-left col p-0">
                  <div className="form-field position-relative z-1">
                    <DatePicker
                      selected={expDate}
                      onChange={(dt) => {
                        const mmyy = dt?.toLocaleDateString("en", {
                          month: "2-digit",
                          year: "numeric",
                        });
                        setExpDate(dt);
                        formik.setFieldValue("expiry_date", mmyy);
                      }}
                      name="expiry_date"
                      dateFormat="MM/yyyy"
                      className="form-control"
                      placeholderText="Expiration Date"
                      onBlur={formik.handleBlur}
                      showMonthYearPicker
                    />
                    <IconCalender
                      className="position-absolute"
                      stroke="#0081c5"
                      style={{ top: "15px", right: "20px" }}
                    />
                    <p className="text-danger ps-2 shadow-none">
                      {formik.touched.expiry_date && formik.errors.expiry_date}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-12 col-right col p-0">
                  <div className="form-field">
                    <Input
                      type="password"
                      className="form-control"
                      placeholder="Security Code"
                      name="security_code"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      maxength="3"
                      value={formik.values.security_code}
                      error={
                        formik.touched.security_code &&
                        formik.errors.security_code
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
                  <div className="form-field">
                    <Input
                      type="text"
                      id="billing_address"
                      className="form-control"
                      placeholder="Billing Address"
                      name="billing_address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.billing_address}
                      error={
                        formik.touched.billing_address &&
                        formik.errors.billing_address
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0 btns-inline">
                  <div className="setting-btn-link btn-wrap">
                    <Link to="/wallet" className="outline-btn">
                      <IconLeftArrow stroke="#0081c5" />
                      Wallet
                    </Link>
                  </div>
                  <div className="btn-wrap">
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Add New Card"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCard;
