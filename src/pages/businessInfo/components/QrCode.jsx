import Button from "components/ui/Button";
import ImageQR from "components/ui/ImageQR";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import LoaderProfileQr from "loaders/LoaderProfileQr";

const QrCode = (props) => {
  const { qrCodeImg } = props;
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleGenerateQrCode = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.generateNewQrCode();
      if (data.success) {
        await dispatch(fetchUserProfile());
        toast.success("QR code generated successfully.");
      }

      if (!data.success) throw data.message;
    } catch (err) {
      console.error("err: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="profile-qr">
      <div className="profile-qr-inner">
        {isImageLoading && <LoaderProfileQr height={120} width={120} />}
        {!imageError ? (
          <ImageQR
            src={qrCodeImg || ""}
            fallbacksrc={"/assets/images/QR_not_found.png"}
            alt="QR code image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={isImageLoading ? { display: "none" } : {}}
          />
        ) : (
          <div>Failed to load QR</div>
        )}
      </div>
      <Button
        type="button"
        onClick={handleGenerateQrCode}
        className="btn qr-btn"
        disabled={isImageLoading || imageError}
      >
        Refresh QR
      </Button>
    </div>
  );
};

export default QrCode;
