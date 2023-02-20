import FileInput from "components/ui/FileInput";
import { useFormik } from "formik";
import React from "react";

function UploadImage(props) {
  const { handleUpload } = props;

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
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" style={{ minWidth: "500px" }}>
        <div class="modal-header">
          <h3>Customize Card</h3>
        </div>
        <div class="modal-body">
          <div class="custimize-iu-wrap">
            <form class="">
              <FileInput
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
                class="cust-image-upload-wrap image_upload_click"
                htmlFor="fileInput_scci"
              >
                <div>
                  <img src="/assets/images/upload-image.svg" alt="" />
                  <p>Upload Image</p>
                </div>
              </label>
            </form>
            <a href="" class="cancel-link" data-bs-dismiss="modal">
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;
