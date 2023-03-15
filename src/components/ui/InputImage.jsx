import { LoaderContext } from "context/loaderContext";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";

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

  const handleFocusBack = useCallback(() => {
    handleChange({ currentTarget: { files: [] } });
    window.removeEventListener("focus", handleFocusBack);
  }, [onChange]);

  const clickedFileInput = useCallback(() => {
    window.addEventListener("focus", handleFocusBack);
  }, [handleFocusBack]);

  return (
    <div className={`upload-profile-image text-center ${className}`}>
      <label
        htmlFor={`fileInput${id}`}
        className={`cursor-pointer ${classNameLabel}`}
      >
        {showPreview && (
          <span
            className={`profile-wrap overflow-hidden mx-auto ${classNameBorder}`}
          >
            <img
              src={preview}
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
        )}
        {showLabel && labelText}
      </label>
      <input
        id={`fileInput${id}`}
        name={name}
        type={"file"}
        className={`${classNameInput}`}
        onChange={handleChange}
        onClick={clickedFileInput}
        accept={accept}
      />
      {error && (
        <p className="text-danger ps-2" style={{ width: "inherit" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default InputImage;
