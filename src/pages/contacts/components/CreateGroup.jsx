import React, { useContext,useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Input from "components/ui/Input";
import { createGroupSchema } from "schemas/validationSchema";
import InputFile from "components/ui/InputImage";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import styles from "../addGroup.css";
import { LoaderContext } from "context/loaderContext";

export default function CreateGroup(props){
    const profile_image = null;
    const navigate = useNavigate();
    const { setIsLoading } = useContext(LoaderContext);

    const formik = useFormik({
        initialValues: {
          group_name : "",
          group_image : "",
          contact : props.values
        },
        validateOnChange: false, // this one
        validateOnBlur: false, // and this one
        validationSchema: createGroupSchema,
        onSubmit: async (values, { resetForm, setStatus }) => {
            console.log(values);
            setIsLoading(true);
            const formData = new FormData();
            for (let key in values) {
                if (key === "group_image") continue;
                if (key === "contact"){
                    values[key].forEach(contact => formData.append('contact[]', contact));
                }else{
                    formData.append(key, values[key]);
                }
            }
            formData.append("group_image", values.group_image);
            const { data } = await apiRequest.addGroup(formData);
            if (!data.success) throw data.message;
            toast.success(data.message);
            setIsLoading(false);
            navigate('/send'); 
        }
    });
    return (
        <div className="modal-dialog modal-save-group modal-dialog-centered">
            <div className="modal-content group-save-modal-content">
                <div className="modal-header">
                    <InputFile
                        id="_upPersonal"
                        name="profile_image"
                        onChange={(e) => {
                            formik.setFieldValue(
                                "group_image",
                                e.currentTarget.files[0]
                            );
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
                            Change Group Image
                        </label>
                    </p>
                    <form onSubmit={formik.handleSubmit} className="save-group-form">
                        <div className="form-field">
                            <Input type="text"
                                className="form-control w-100"
                                placeholder="Group Name"
                                name="group_name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.group_name}
                                error={
                                    formik.touched.group_name &&
                                    formik.errors.group_name
                                } />    
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
    )
}