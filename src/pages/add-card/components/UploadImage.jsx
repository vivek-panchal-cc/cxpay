import InputImage from "components/ui/InputImage";
import { useFormik } from "formik";
import React from "react";
import { uploadCardImageSchema } from "schemas/walletSchema";

function UploadImage(props) {
  const { handleUpload, closeModal } = props;

  const formik = useFormik({
    initialValues: {
      card_image: "",
    },
    validationSchema: uploadCardImageSchema,
    onSubmit: async (values, { setStatus, setErrors, setValues }) => {
      handleUpload(URL.createObjectURL(values.card_image));
    },
  });

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content" style={{ minWidth: "500px" }}>
        <div className="modal-header">
          <h3>Crop image</h3>
        </div>
        <div className="modal-body">
          <div className="custimize-iu-wrap">
            <form>
              <InputImage
                id="_scci"
                name="card_image"
                onChange={async (e) => {
                  await formik.setFieldValue(
                    "card_image",
                    e.currentTarget.files[0]
                  );
                  await formik.submitForm();
                }}
                error={formik.errors.card_image}
                showPreview={false}
                showLabel={false}
                fallbackSrc="/assets/images/profile-img.png"
                classNameInput="d-none"
                accept={"image/*"}
              />
              <label
                className="cust-image-upload-wrap image_upload_click"
                htmlFor="fileInput_scci"
              >
                <div>
                  <img src="/assets/images/upload-image.svg" alt="" />
                  <p>Upload Image</p>
                </div>
              </label>
            </form>
            <button
              type="button"
              className="cancel-link cursor-pointer border-0 bg-transparent"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
