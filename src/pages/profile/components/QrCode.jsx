import Button from "components/ui/Button";
import Image from "components/ui/Image";
import { LoaderContext } from "context/loaderContext";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  EmailShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookMessengerIcon,
  WhatsappIcon,
} from "react-share";
import clipboardCopy from "clipboard-copy";
import { IconSend } from "styles/svgs";

const QrCode = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const { qrCodeImg } = props;
  const appId = process.env.REACT_APP_FACEBOOK_APP_ID;
  const title = "Check out this QR code!";
  const dispatch = useDispatch();
  const [showShareOptions, setShowShareOptions] = useState(false);

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

  // const handleShareQrCode = () => {
  //   if (qrCodeImg) {
  //     clipboardCopy(qrCodeImg);
  //     toast.success("QR code link copied to clipboard!");
  //   } else {
  //     toast.error("No QR code link available to share.");
  //   }
  // };

  const handleWhatsAppShare = () => {
    const message = `Check out this QR code: ${qrCodeImg}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleMessengerShare = () => {
    const encodedURL = encodeURIComponent(qrCodeImg);
    const messengerURL = `https://www.facebook.com/dialog/send?app_id=YOUR_APP_ID&link=${encodedURL}&redirect_uri=${encodedURL}`;
    window.open(messengerURL, "_blank");
  };

  const handleEmailShare = () => {
    const subject = "Check out this QR code!";
    const body = `Here is a QR code you might be interested in:\n${qrCodeImg}\nPlease copy and paste the link into your browser to view the QR code.`;
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:?subject=${subject}&body=${encodedBody}`, "_self");
  };

  return (
    <div className="profile-qr">
      <div className="profile-qr-inner">
        {qrCodeImg ? (
          <Image src={qrCodeImg} alt="QR code image" />
        ) : (
          <Image src="/assets/images/QR_not_found.png" alt="QR code image" />
        )}
      </div>
      {/* <p>{qrDescription ?? 'Lorem Ipsum Dolor Stie Amet'}</p> */}
      <Button
        type="button"
        onClick={handleGenerateQrCode}
        className="btn qr-btn"
        style={{ marginBottom: "20px" }}
      >
        Refresh QR
      </Button>
      {qrCodeImg && (
        <Button
          type="button"
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="btn qr-share-icon"
        >
          <span>
            <IconSend style={{ stroke: "#F3F3F3" }} />
          </span>
        </Button>
      )}
      {showShareOptions && (
        <div className={`share-options ${showShareOptions ? "active" : ""}`}>
          <WhatsappShareButton url={qrCodeImg} title={title}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          {/* <FacebookMessengerShareButton appId={appId} url={qrCodeImg}>
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton> */}

          <EmailShareButton
            url={qrCodeImg}
            subject={title}
            body={`Here is a QR code you might be interested in:`}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      )}
    </div>
  );
};

export default QrCode;
