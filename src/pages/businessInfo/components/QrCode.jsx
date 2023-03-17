import Button from "components/ui/Button";
import Image from "components/ui/Image";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const QrCode = (props) => {
  const { qrCodeImg } = props;
  const dispatch = useDispatch();

  const handleGenerateQrCode = async () => {
    try {
      const { data } = await apiRequest.generateNewQrCode();
      if (data.success) {
        await dispatch(fetchUserProfile());
        toast.success("QR code generated successfully.");
      }

      if (!data.success || data.data === null) throw data.message;
    } catch (err) {
      console.error("err: ", err.message);
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
