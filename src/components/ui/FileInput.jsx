import React from "react";
import { useState } from "react";

function FileInput(props) {
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
    classNameLabel,
    classNameInput,
    classNameImage,
    classNameBorder,
    className,
  } = props;
  const [preview, setPreview] = useState(previewSrc);
  const [isError, setIsError] = useState(false);

  return (
    <div className={`upload-profile-image text-center ${className}`}>
      <label
        htmlFor={`fileInput${id}`}
        className={`cursor-pointer ${classNameLabel}`}
      >
        {showPreview && (
          <span className={`profile-wrap overflow-hidden ${classNameBorder}`}>
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
        onChange={(e) => {
          onChange(e);
          if (showPreview && e.currentTarget.files.length > 0)
            return setPreview(URL.createObjectURL(e.currentTarget.files[0]));
          setPreview("");
        }}
      />
      {error && <p className="text-danger ps-2">{error}</p>}
    </div>
  );
}

export default FileInput;