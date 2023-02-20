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
      class="modal-dialog modal-dialog-centered"
      style={{ maxWidth: "max-content" }}
    >
      <div class="modal-content overflow-hidden">
        <div class="modal-header">
          <h3>Crop Image</h3>
        </div>
        <div class="modal-body">
          <div class="custimize-iu-wrap">
            <div
              className="position-relative"
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
              <span className="col-1"></span>
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
              <div className="col-3 d-flex justify-content-around">
                <button type="button" className="p-1" onClick={handleSelect}>
                  select
                </button>
                <button className="p-1">cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropCard;
