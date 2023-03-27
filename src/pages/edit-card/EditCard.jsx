import React, { useContext, useMemo, useState } from "react";
import Modal from "components/modals/Modal";
import Input from "components/ui/Input";
import { replace, useFormik } from "formik";
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
import { useDispatch, useSelector } from "react-redux";
import useCountriesCities from "hooks/useCountriesCities";
import InputSelect from "components/ui/InputSelect";
import { setEditCard } from "features/user/userProfileSlice";
import useCardColors from "hooks/useCardColors";

function EditCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const { card } = useSelector((state) => state.userProfile);
  const {
    card_holder_first_name,
    card_holder_last_name,
    country,
    city,
    id,
    color,
    email,
    billing_address,
  } = card || {};

  const [showPopupUpload, setShowPopupUpload] = useState(false);
  const [showPopupCrop, setShowPopupCrop] = useState(false);
  const [cardBackImg, setCardBackImg] = useState("");
  const [croppedImg, setCroppedImg] = useState({
    file: "",
    url: card?.image,
  });
  const [countryList, cityList] = useCountriesCities();
  const [cardColors] = useCardColors();

  const { country_index, country_iso } = useMemo(() => {
    if (!country) return {};
    const country_index = countryList.findIndex(
      (e) => e.country_name === country
    );
    const { iso } = countryList.find((e) => e.country_name === country) || {};
    return { country_index, country_iso: iso };
  }, [country, countryList]);

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
    enableReinitialize: true,
    initialValues: {
      id: id || "",
      color: color || cardColors?.[0],
      email: email || "",
      country: country || "",
      country_index: country_index,
      country_iso: country_iso,
      city: city || "",
      //
      card_holder_first_name: card_holder_first_name,
      card_holder_last_name: card_holder_last_name,
      billing_address: billing_address,
    },
    validationSchema: EditCardSchema,
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) formData.append(key, values[key]);
        // if (card.color !== values.color) formData.append("color", values.color);
        if (croppedImg.file) formData.append("image", croppedImg.file);
        const { data } = await apiRequest.updateCard(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        await dispatch(setEditCard({}));
        navigate("/wallet/view-card", { replace: true });
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          id: error?.id?.[0],
          email: error?.email?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
        });
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
                colorsPallette={cardColors}
                removeBgImg={handleRemoveImage}
                handleChange={handleCustomizePalette}
              />
            </div>
          </div>
          <div className="add-wallet-card-form-wrap">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-12 col-left col p-0">
                  <Input
                    type="text"
                    className="form-control opacity-75"
                    placeholder="Credit Card Number"
                    name="card_number"
                    value={"XXXX XXXX XXXX " + card?.card_number}
                    disabled
                  />
                </div>
                <div className="col-lg-6 col-12 col-right col p-0">
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
              {/* <div className="row">
                <div className="col-lg-6 col-12 col-right col p-0">
                  <Input
                    type="password"
                    id="security_code"
                    className="form-control opacity-75"
                    placeholder="Security Code"
                    name="security_code"
                    value="***"
                    disabled
                  />
                </div>
              </div> */}
              <div className="row">
                <div className="col-lg-6 col-12 col-left p-0">
                  <Input
                    type="name"
                    className="form-control"
                    placeholder="First Name"
                    name="card_holder_first_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.card_holder_first_name}
                    error={
                      formik.touched.card_holder_first_name &&
                      formik.errors.card_holder_first_name
                    }
                  />
                </div>
                <div className="col-lg-6 col-12 col-right p-0">
                  <Input
                    type="name"
                    className="form-control"
                    placeholder="Last Name"
                    name="card_holder_last_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.card_holder_last_name}
                    error={
                      formik.touched.card_holder_last_name &&
                      formik.errors.card_holder_last_name
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0">
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
              <div className="form-field two-fields">
                <div className="field-half">
                  <InputSelect
                    className="form-select form-control"
                    name="country_index"
                    onChange={({ currentTarget }) => {
                      const i = parseInt(currentTarget.value);
                      formik.setFieldValue("country_index", i);
                      formik.setFieldValue("country_iso", countryList[i]?.iso);
                      formik.setFieldValue(
                        "country",
                        countryList[i]?.country_name
                      );
                      formik.setFieldValue("city", "");
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.country_index}
                    error={
                      formik.touched.country_index && formik.errors.country
                    }
                  >
                    <option value={"-1"}>Select Country</option>
                    {countryList?.map((country, index) => (
                      <option key={index} value={index}>
                        {country.country_name}
                      </option>
                    ))}
                  </InputSelect>
                </div>
                <div className="field-half">
                  <InputSelect
                    className="form-select form-control"
                    name="city"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                    error={formik.touched.city && formik.errors.city}
                  >
                    <option value={""}>Select City</option>
                    {cityList[formik.values.country_iso]?.map((city, index) => (
                      <option key={index} value={city.city_name}>
                        {city.city_name}
                      </option>
                    ))}
                  </InputSelect>
                </div>
              </div>
              <div className="row">
                <div className="col-12 p-0 btns-inline">
                  <div className="setting-btn-link btn-wrap">
                    <Link
                      to="/wallet/view-card"
                      replace
                      className="outline-btn"
                    >
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
