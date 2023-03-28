import Button from "components/ui/Button";
import Image from "components/ui/Image";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";

const QrCode = (props) => {
  const { qrCodeImg } = props;
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);

  const handleGenerateQrCode = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.generateNewQrCode();
      if (data.success) {
        await dispatch(fetchUserProfile());
        toast.success("QR code generated successfully.");
      }

      if (!data.success || data.data === null) throw data.message;
    } catch (err) {
      console.error("err: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="profile-qr">
      <div className="profile-qr-inner">
        <Image src={qrCodeImg} alt="QR code image" />
      </div>
      <Button onClick={handleGenerateQrCode} className="btn qr-btn">
        Request new QR
      </Button>
    </div>
  );
};

export default QrCode;