import Modal from "components/modals/Modal";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import { addCardSchema } from "schemas/walletSchema";
import CreditCard from "./components/CreditCard";
import CropCard from "./components/CropCard";
import CustomizePalette from "./components/CustomizePalette";
import UploadImage from "./components/UploadImage";
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import { IconCalender, IconLeftArrow } from "styles/svgs";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { LoaderContext } from "context/loaderContext";

function AddCard() {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const [showPopupUpload, setShowPopupUpload] = useState(false);
  const [showPopupCrop, setShowPopupCrop] = useState(false);
  const [cardBackImg, setCardBackImg] = useState("");
  const [croppedImg, setCroppedImg] = useState({
    file: "",
    url: "",
  });
  const [expDate, setExpDate] = useState();

  const handleUploadImage = (img) => {
    setCardBackImg(img);
    setShowPopupCrop(true);
  };

  const handleCropImage = (cropImgObj) => {
    setCroppedImg(cropImgObj);
    setShowPopupUpload(false);
    setShowPopupCrop(false);
  };

  const handleRemoveImage = () => {
    setCroppedImg({ file: "", url: "" });
  };

  const handleClosePopupUpload = () => setShowPopupUpload(false);

  const handleClosePopupCrop = () => setShowPopupCrop(false);

  const formik = useFormik({
    initialValues: {
      card_number: "",
      expiry_date: "", // mm-yyyy
      billing_address: "",
      card_holder_name: "",
      color: "",
    },
    validationSchema: addCardSchema,
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) formData.append(key, values[key]);
        if (croppedImg.file) formData.append("image", croppedImg.file);
        const { data } = await apiRequest.addCard(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        resetForm();
        setExpDate();
        setCroppedImg({ file: "", url: "" });
        navigate("/wallet/view-card");
      } catch (error) {
        if (typeof error === "string") {
          toast.error(error);
          resetForm();
          setExpDate();
          setCroppedImg({ file: "", url: "" });
          return;
        }
        setErrors({
          billing_address: error?.billing_address?.[0],
          card_holder_name: error?.card_holder_name?.[0],
          card_number: error?.card_number?.[0],
          expiry_date: error?.expiry_date?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCustomizePalette = (color) => {
    if (color === "white") return setShowPopupUpload(true);
    formik.setFieldValue("color", color);
  };

  return (
    <div className="wallet-add-card-main wallet-page-body mb-4">
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
            <Breadcrumb />
          </div>
          <div className="row wac-details-wrap">
            <div className="p-0 col-lg-7 col-12 wallet-ac-info-wrap z-0">
              <CreditCard
                details={{ ...formik.values, bg_img: croppedImg.url }}
              />
            </div>
            <div className="p-0 col-lg-5 col-12">
              <CustomizePalette
                color={formik.values.color}
                bgimg={croppedImg.url}
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
                <div className="col-lg-7 col-12 col-left col p-0">
                  <div className="form-field">
                    <Input
                      type="text"
                      id="card_holder_name"
                      className="form-control"
                      placeholder="Card Holder Name"
                      name="card_holder_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.card_holder_name}
                      error={
                        formik.touched.card_holder_name &&
                        formik.errors.card_holder_name
                      }
                    />
                  </div>
                </div>
                <div className="col-lg-5 col-12 col-right col p-0">
                  <div className="form-field position-relative z-1">
                    <DatePicker
                      id="datepickeradd-card"
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
                    <label
                      htmlFor="datepickeradd-card"
                      className="position-absolute"
                      style={{ top: "14px", right: "20px" }}
                    >
                      <IconCalender stroke="#0081c5" />
                    </label>
                    <p className="text-danger ps-2 shadow-none">
                      {formik.touched.expiry_date && formik.errors.expiry_date}
                    </p>
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
                    <Link to="/wallet" replace className="outline-btn">
                      Cancel
                    </Link>
                  </div>
                  <div className="btn-wrap">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      } ${formik.isValid ? "" : "opacity-75"}`}
                      disabled={formik.isSubmitting}
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
