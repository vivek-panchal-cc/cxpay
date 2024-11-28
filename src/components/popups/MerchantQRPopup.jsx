import ImageQR from "components/ui/ImageQR";
import LoaderProfileQr from "loaders/LoaderProfileQr";
import React, { useState } from "react";
import {
  EmailIcon,
  EmailShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { IconCloseModal } from "styles/svgs";

const MerchantQRPopup = (props) => {
  const { setShow, details } = props;
  const { qr_code_merchant_image, profile_image, mobile, name } = details || {};
  const title = "Check out this QR code!";
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };
  return (
    <div className="container">
      <div className="row">
        <div
          className="login-signup-content-wrap login-signup01-content-wrap"
          style={{ padding: "38px 50px 41px", maxWidth: "450px" }}
        >
          <IconCloseModal
            style={{
              position: "absolute",
              top: "25px",
              right: "25px",
              cursor: "pointer",
            }}
            onClick={() => setShow(false)}
          />{" "}
          <div className="login-signup-inner">
            <h4 className="blue-text text-center">Payment Request</h4>
            <div className="modal-body d-flex justify-content-center">
              <div className="merchant-qr-inner w-auto">
                {isImageLoading && <LoaderProfileQr height={200} width={200} />}
                {!imageError ? (
                  <ImageQR
                    src={qr_code_merchant_image || ""}
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
            </div>
            <div className="share-options active mb-3">
              <WhatsappShareButton url={qr_code_merchant_image} title={title}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <EmailShareButton
                url={qr_code_merchant_image}
                subject={title}
                body={`Here is a QR code you might be interested in:`}
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
            <label
              className={`${"mer-list-uimg-mh-mw d-flex m-0 p-0 justify-content-center"}`}
            >
              <div className="con-list-uimg">
                <img
                  src={
                    profile_image
                      ? profile_image
                      : "/assets/images/single_contact_profile.png"
                  }
                  className="blue-bg border"
                  // style={{ border: "1px solid #f3f3f3" }}
                  alt=""
                />
              </div>
              <div className="d-flex flex-column">
                <span>
                  {name && <div className="mer-list-uname-qr w-0">{name}</div>}
                </span>
                <span>
                  {mobile && (
                    <div className="mer-list-uname-qr mobile w-0">{`+${mobile}`}</div>
                  )}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantQRPopup;
