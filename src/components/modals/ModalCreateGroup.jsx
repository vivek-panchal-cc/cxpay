import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Input from "components/ui/Input";
import { createGroupSchema } from "schemas/validationSchema";
import InputFile from "components/ui/InputImage";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import styles from "../../pages/contacts/addGroup.css";
import { LoaderContext } from "context/loaderContext";
import stylescss from "./modal.module.scss";
import { addObjToFormData } from "helpers/commonHelpers";

const ModalCreateGroup = (props) => {
  const { selectedContacts, show, setShow, id, setSelectedContacts } = props;
  const profile_image = null;
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const [isProfileImage, setIsProfileImage] = useState(false);
  const modalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      group_name: "",
      group_image: "",
      contact: [],
    },
    validateOnChange: false, // this one
    validateOnBlur: false, // and this one
    validationSchema: createGroupSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        const muValues = { ...values };
        const contactArr = [];
        selectedContacts?.forEach((contact) => contactArr.push(contact));
        muValues.contact = contactArr;
        for (const key in muValues)
          addObjToFormData(muValues[key], key, formData);
        formData.append("group_image", values.group_image);
        const { data } = await apiRequest.addGroup(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        if (setShow) setShow(false);
        setSelectedContacts([]);
        navigate("/send");
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          group_name: error?.group_name?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        if (setShow) setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  if (!show) return null;

  return (
    <div
      className={`modal fade show ${stylescss.modal} del-modal-main`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef}>
        <div className="modal-dialog modal-save-group modal-dialog-centered">
          <div className="modal-content group-save-modal-content">
            <div className="modal-header">
              <InputFile
                id="_upPersonal"
                name="profile_image"
                onChange={(e) => {
                  formik.setFieldValue("group_image", e.currentTarget.files[0]);
                  setIsProfileImage(true);
                }}
                error={formik.errors.group_image}
                showPreview={
                  profile_image
                    ? profile_image
                    : "/assets/images/group-icon-image.png"
                }
                showLabel={false}
                previewSrc={
                  profile_image
                    ? profile_image
                    : "/assets/images/group-icon-image.png"
                }
                fallbackSrc={
                  profile_image
                    ? profile_image
                    : "/assets/images/group-icon-image.png"
                }
                classNameInput="d-none"
                classNameBorder={`overflow-visible group-icon-image ${styles.set_group_background_image}`}
                classNameImage={`${styles.set_group_image}`}
                isGroup={true}
              />
            </div>
            <div className="modal-body text-center">
              <h3>Save Group</h3>
              <p>
                <label
                  htmlFor="fileInput_upPersonal"
                  className="cursor-pointer"
                  style={{ color: "#0081c5" }}
                >
                  {isProfileImage ? "Change Group Image" : "Select Group Image"}
                </label>
              </p>
              <form onSubmit={formik.handleSubmit} className="save-group-form">
                <div className="form-field">
                  <Input
                    type="text"
                    className="form-control w-100"
                    placeholder="Group Name"
                    name="group_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.group_name}
                    error={
                      formik.touched.group_name && formik.errors.group_name
                    }
                  />
                </div>
                <div className="verify-code-btn-wrap">
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    disabled={formik.isSubmitting}
                    value="Save Group"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateGroup;
