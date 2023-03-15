import React, { useContext, useEffect, useState } from "react";
import Modal from "components/modals/Modal";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { addCardSchema } from "schemas/walletSchema";
// import CreditCard from "./components/CreditCard";
// import CropCard from "./components/CropCard";
// import CustomizePalette from "./components/CustomizePalette";
// import UploadImage from "./components/UploadImage";
// import DatePicker from "react-datepicker";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import { IconCalender } from "styles/svgs";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { LoaderContext } from "context/loaderContext";
import UploadImage from "pages/add-card/components/UploadImage";
import CropCard from "pages/add-card/components/CropCard";
import CreditCard from "pages/add-card/components/CreditCard";
import CustomizePalette from "pages/add-card/components/CustomizePalette";
import { useSelector } from "react-redux";

function EditCard() {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { card } = useSelector((state) => state.userProfile);

  const [showPopupUpload, setShowPopupUpload] = useState(false);
  const [showPopupCrop, setShowPopupCrop] = useState(false);
  const [cardBackImg, setCardBackImg] = useState("");
  const [croppedImg, setCroppedImg] = useState({
    file: "",
    url: "",
  });

  const handleUploadImage = (img) => {
    setCardBackImg(img);
    setShowPopupCrop(true);
  };

  const handleCropImage = (cropImgObj) => {
    setCroppedImg(cropImgObj);
    setShowPopupUpload(false);
    setShowPopupCrop(false);
    formik.setFieldValue("color", "white");
  };

  const handleRemoveImage = () => {
    setCroppedImg({ file: "", url: "" });
  };

  const handleClosePopupUpload = () => setShowPopupUpload(false);

  const handleClosePopupCrop = () => setShowPopupCrop(false);

  const formik = useFormik({
    initialValues: {
      card_number: card.card_number || "",
      expiry_date: card.expiry_date || "", // mm-yyyy
      billing_address: card.billing_address || "",
      card_holder_name: card.card_holder_name || "",
      color: card.color || "",
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
        setCroppedImg({ file: "", url: "" });
        navigate("/wallet/view-card");
      } catch (error) {
        if (typeof error === "string") {
          toast.error(error);
          resetForm();
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
    if (croppedImg.url) handleRemoveImage();
    formik.setFieldValue("color", color);
  };

  useEffect(() => {
    if (card && card.color) handleCustomizePalette(card.color);
  }, [card]);

  if (!card || Object.keys(card).length <= 0)
    return <Navigate to={"/wallet/view-card"} replace />;

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
            <h3>Edit a Card</h3>
            <Breadcrumb />
          </div>
          {formik.values.color && (
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
          )}
          <div className="add-wallet-card-form-wrap">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-12 col p-0">
                  <div className="form-field">
                    <Input
                      type="text"
                      className="form-control opacity-75"
                      placeholder="Credit Card Number"
                      name="card_number"
                      value={formik.values.card_number}
                      disabled
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
                      className="form-control opacity-75"
                      placeholder="Card Holder Name"
                      name="card_holder_name"
                      value={formik.values.card_holder_name}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-lg-5 col-12 col-right col p-0">
                  <div className="form-field position-relative z-1">
                    <Input
                      type="text"
                      id="expiry_date"
                      className="form-control opacity-75"
                      placeholderText="Expiration Date"
                      name="expiry_date"
                      value={formik.values.expiry_date}
                      disabled
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
                      className="form-control opacity-75"
                      placeholder="Billing Address"
                      name="billing_address"
                      value={formik.values.billing_address}
                      disabled
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
                      value="Save Changes"
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

export default EditCard;
