import React, { useEffect, useState } from "react";
import { IconDownload, IconPlusBorder, IconUpload } from "styles/svgs";
import Button from "components/ui/Button";
import styles from "./uploadFile.module.scss";

const UploadFile = (props) => {
  const {
    name = "",
    files = [],
    onChange = () => {},
    showPreview = true,
    max = 3,
    maxSize = Number.MAX_VALUE,
    error = "",
  } = props || {};

  const [previewImgs, setPreviewImgs] = useState([]);

  useEffect(() => {
    if (!showPreview || !files || files.length <= 0) {
      setPreviewImgs([]);
      return;
    }
    const previews = files?.map((file) => ({
      url: URL.createObjectURL(file),
      size: file.size,
      isError: file?.size > maxSize,
    }));
    setPreviewImgs(previews);
  }, [files]);

  const handleChange = async (e) => {
    const tmpfiles = e?.target?.files || [];
    if (tmpfiles.length <= 0) return;
    onChange([...files, ...tmpfiles]);
    e.target.value = null;
  };

  const handleDeleteFile = (index) => {
    const filteredFiles = files.filter((f, i) => i !== index);
    onChange(filteredFiles);
  };

  return (
    <div className={`${styles.uploadfile}`}>
      <div className="row">
        <div
          className="col-12 p-0"
          style={{ height: files.length > 0 ? "0" : "fit-content" }}
        >
          <input
            id="upload_receipt"
            type="file"
            name={name}
            onChange={handleChange}
            accept="*"
            multiple
          />
          {(!files || files.length <= 0) && (
            <div className="form-field">
              <div className="fc-upload-receipt-wrap">
                <label htmlFor="upload_receipt" className="">
                  <IconUpload stroke={"#0081C5"} />
                  Upload receipt
                </label>
              </div>
              {/* <p className="red">Note: Allowed formats are JPEG, PNG, PDF, JPG</p> */}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-0">
          <div className={`form-field ${previewImgs.length <= 0 ? "m-0" : ""}`}>
            <ul className="fund-cash-download-wrap">
              {previewImgs?.map((item, index) => (
                <li
                  key={item?.url || index}
                  className=""
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.40), rgba(0, 0, 0, 0.40)), url('${item?.url}')`,
                    border: item?.isError ? "2px solid red" : "",
                    boxShadow: item?.isError ? "inset 0 0 15px #ff0000" : "",
                  }}
                >
                  <div className="fc-download-file">
                    <a href={item} download>
                      <IconDownload stroke={"#fff"} />
                    </a>
                  </div>
                  <Button
                    className="fc-del-pdf border-0"
                    onClick={() => handleDeleteFile(index)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
              {files.length < max && files.length > 0 ? (
                <li>
                  <div>
                    <label
                      htmlFor="upload_receipt"
                      className="border-0 bg-transparent cursor-pointer"
                    >
                      <IconPlusBorder stroke={"#BDBDBD"} />
                    </label>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
          <p className="red mx-2 text-[#dc3545] font-bold">
            Note: Allowed formats are JPEG, PNG, PDF, JPG
          </p>
        </div>
      </div>
      <p className="text-danger ps-2 mt-0 pb-2">{error}</p>
    </div>
  );
};

export default UploadFile;
