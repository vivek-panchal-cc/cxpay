import InputFile from "components/ui/InputFile";
import { useFormik } from "formik";
import React from "react";

function UploadImage(props) {
  const { handleUpload, closeModal } = props;

  const formik = useFormik({
    initialValues: {
      card_image: "",
    },
    validationSchema: "",
    onSubmit: async (values, { setStatus, setErrors, setValues }) => {
      handleUpload(URL.createObjectURL(values.card_image));
    },
  });

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content" style={{ minWidth: "500px" }}>
        <div className="modal-header">
          <h3>Customize Card</h3>
        </div>
        <div className="modal-body">
          <div className="custimize-iu-wrap">
            <form className="">
              <InputFile
                id="_scci"
                name="card_image"
                onChange={(e) => {
                  handleUpload(URL.createObjectURL(e.currentTarget.files[0]));
                  formik.setFieldValue("card_image", e.currentTarget.files[0]);
                }}
                error={formik.errors.card_image}
                showPreview={false}
                showLabel={false}
                fallbackImg="/assets/images/profile-img.png"
                classNameInput="d-none"
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
            <a className="cancel-link cursor-pointer" onClick={closeModal}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
