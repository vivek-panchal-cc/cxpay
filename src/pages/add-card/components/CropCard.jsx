import getCroppedImg from "helpers/croppedImage";
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

function CropCard(props) {
  const { src, onImgCropped } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixel] = useState();
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixel(croppedAreaPixels);
  }, []);

  const handleSelect = useCallback(async () => {
    const img = await getCroppedImg(src, croppedAreaPixels);
    onImgCropped(img);
  }, [getCroppedImg, onImgCropped, croppedAreaPixels]);

  return (
    <div
      className="modal-dialog modal-dialog-centered"
      style={{ maxWidth: "max-content" }}
    >
      <div className="modal-content overflow-hidden">
        <div className="modal-header">
          <h3>Crop Image</h3>
        </div>
        <div className="modal-body">
          <div className="custimize-iu-wrap">
            <div
              className="position-relative rounded-3 overflow-hidden"
              style={{
                height: "358px",
                width: "636px",
              }}
            >
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                cropSize={{ width: 348, height: 213 }}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="pt-4 row d-flex align-items-center">
              <span className="col-1 d-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M20 4C19.5 3 19 2.5 18 2C18 2 13.8431 1 11 1C8.15694 1 4 2 4 2C3 2.5 2.5 3 2 4C2 4 1 8.23858 1 11C1 13.7614 2 18 2 18C2.5 19 2.5 19.5 4 20C4 20 8.15694 21 11 21C13.8431 21 18 20 18 20C19 19.5 19.5 19 20 18C20 18 21 13.7614 21 11C21 8.23858 20 4 20 4Z"
                    stroke="#BDBDBD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9Z"
                    stroke="#BDBDBD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 14L15 9L4 20"
                    stroke="#BDBDBD"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="col-8 d-flex">
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => {
                    setZoom(e.target.value);
                  }}
                  className="w-100"
                />
              </div>
              <div className="col-3 d-flex justify-content-end radio-group-wrap">
                <button
                  type="button"
                  className="radio-round green rounded-4"
                  onClick={handleSelect}
                >
                  <span className="text-white">&#10003;</span>
                </button>
                <button className="radio-round purple ms-3 rounded-4 text-white">
                  <span>&#10005;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropCard;
