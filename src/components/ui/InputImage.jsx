import React, { useContext, useEffect, useState } from "react";
import { LoaderContext } from "context/loaderContext";

function InputImage(props) {
  const {
    id = Math.round(Math.random() * 1000).toString(),
    name,
    onChange,
    error,
    showPreview,
    showLabel,
    labelText = "Select file",
    previewSrc = "",
    fallbackSrc = "",
    classNameLabel = "",
    classNameInput = "",
    classNameImage = "",
    classNameBorder = "",
    className = "",
    accept = "image/*",
    showLoader = false,
    isGroup = false,
  } = props;

  const { setIsLoading } = useContext(LoaderContext);
  const [preview, setPreview] = useState(previewSrc);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (previewSrc) setPreview(previewSrc);
  }, [previewSrc]);

  const handleChange = (e) => {
    onChange(e);
    if (
      showPreview &&
      e.currentTarget.files.length > 0 &&
      e.currentTarget.files[0].type.includes("image/")
    ) {
      if (showPreview && showLoader) setIsLoading(true);
      return setPreview(URL.createObjectURL(e.currentTarget.files[0]));
    }
    setPreview(previewSrc || fallbackSrc);
  };

  return (
    <div className={`upload-profile-image text-center ${className}`}>
      <label
        htmlFor={`fileInput${id}`}
        className={`cursor-pointer ${classNameLabel}`}
      >
        {showPreview ? (
          <span
            className={`${
              typeof showPreview === "string" &&
              showPreview.includes("group-icon-image.png")
                ? ""
                : "profile-wrap"
            }  overflow-hidden mx-auto ${classNameBorder} ${
              !isGroup || preview.includes("group-icon-image.png")
                ? ""
                : "profile-wrap profile-user-up-img"
            }`}
          >
            <img
              src={preview || ""}
              alt="profile img"
              className={`h-100 w-100 object-fit-cover ${classNameImage}`}
              style={{ objectPosition: "center" }}
              onError={
                !isError
                  ? (event) => {
                      event.currentTarget.src = fallbackSrc;
                      setIsError(true);
                    }
                  : null
              }
              onLoad={() => (showLoader ? setIsLoading(false) : null)}
            />
          </span>
        ) : null}
        {showLabel ? labelText : null}
      </label>
      <input
        id={`fileInput${id}`}
        name={name}
        type={"file"}
        className={`${classNameInput}`}
        onChange={handleChange}
        // onClick={clickedFileInput}
        accept={accept}
      />
      {error ? (
        <p className="text-danger ps-2" style={{ width: "inherit" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default InputImage;
