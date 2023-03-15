import React, { useContext, useEffect, useState } from "react";
import Modal from "components/modals/Modal";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { EditCardSchema } from "schemas/walletSchema";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
    url: card?.image,
  });

  const handleUploadImage = (img) => {
    setCardBackImg(img);
    setShowPopupCrop(true);
  };

  const handleCropImage = (cropImgObj) => {
    setCroppedImg(cropImgObj);
    setShowPopupUpload(false);
    setShowPopupCrop(false);
    formik.setFieldValue("color", "");
  };

  const handleRemoveImage = () => {
    setCroppedImg({ file: "", url: "" });
  };

  const handleClosePopupUpload = () => setShowPopupUpload(false);
  const handleClosePopupCrop = () => setShowPopupCrop(false);

  const formik = useFormik({
    initialValues: {
      id: card.id || "",
      color: card.color || "",
    },
    validationSchema: EditCardSchema,
    onSubmit: async (values, { setStatus, resetForm }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("id", values.id);
        if (card.color !== values.color) formData.append("color", values.color);
        if (croppedImg.file) formData.append("image", croppedImg.file);
        const { data } = await apiRequest.updateCard(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        resetForm();
        navigate("/wallet/view-card");
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCustomizePalette = (color) => {
    if (color === "") return setShowPopupUpload(true);
    if (croppedImg.url) handleRemoveImage();
    formik.setFieldValue("color", color);
  };

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
          <div className="row wac-details-wrap">
            <div className="p-0 col-lg-7 col-12 wallet-ac-info-wrap z-0">
              <CreditCard
                details={{
                  ...card,
                  color: formik.values.color,
                  bg_img: croppedImg.url,
                }}
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
                      className="form-control opacity-75"
                      placeholder="Credit Card Number"
                      name="card_number"
                      value={"XXXX XXXX XXXX " + card?.card_number}
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
                      value={card?.card_holder_name}
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
                      placeholder="Expiration Date"
                      name="expiry_date"
                      value={card?.expiry_date}
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
                      value={card?.billing_address}
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
