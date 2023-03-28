import { LoaderContext } from "context/loaderContext";
import getCroppedImg from "helpers/croppedImage";
import React, { useCallback, useContext, useState } from "react";
import Cropper from "react-easy-crop";
import { IconCancleBg, IconCheckBg, IconImage } from "styles/svgs";
import styles from "../addCard.module.scss";

function CropCard(props) {
  const { setIsLoading } = useContext(LoaderContext);

  const { src, onImgCropped, closeModal } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixel] = useState();
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixel(croppedAreaPixels);
  }, []);

  const handleSelect = useCallback(async () => {
    setIsLoading(true);
    try {
      // getCroppedImg return As blob
      const imgObj = await getCroppedImg(src, croppedAreaPixels);
      onImgCropped(imgObj);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [onImgCropped, croppedAreaPixels, src]);

  const handleRangeChange = useCallback((e) => {
    const min = e.currentTarget.min;
    const max = e.currentTarget.max;
    const val = e.currentTarget.value;
    e.currentTarget.style.backgroundSize =
      ((val - min) * 100) / (max - min) + "% 100%";
    setZoom(val);
  }, []);

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
              className={`position-relative rounded-3 overflow-hidden ${styles.cropper_wrap}`}
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
                <IconImage stroke="#BDBDBD" />
              </span>
              <div className={`col-8 d-flex ${styles.range_container}`}>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={handleRangeChange}
                  className="w-100"
                />
              </div>
              <div
                className={`col-3 d-flex justify-content-end radio-group-wrap crop_container`}
              >
                <button
                  type="button"
                  className="radio-round rounded-4"
                  onClick={handleSelect}
                >
                  <span className="text-white">
                    <IconCheckBg />
                  </span>
                </button>
                <button
                  className="radio-round ms-3 rounded-4 text-white"
                  onClick={closeModal}
                >
                  <span>
                    <IconCancleBg />
                  </span>
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
