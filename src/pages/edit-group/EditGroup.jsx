import Input from "components/ui/Input";
import InputFile from "components/ui/InputImage";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "../contacts/addGroup.css";
import "./editGroup.css";
import EditGroupList from 'components/contacts-list/EditGroupList';
import { createGroupSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ModalConfirmation from "components/modals/ModalConfirmation";

export default function EditGroup() {
    let {id} = useParams();
    const navigate = useNavigate(); 
    const [contactList,setContactList] = useState([]);
    const [groupDetail,setGroupDetail] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            group_id : null,
            group_name : "",
            group_image : null,
            contact : []
        },
        validationSchema: createGroupSchema,
        onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
            const formData = new FormData();
            for (let key in values) {
                if (key === "group_image") continue;
                if (key === "contact"){
                    if(values[key].length > 0){
                        values[key].forEach(contact => formData.append('contact[]', contact));
                    }
                }else{
                    formData.append(key, values[key]);
                }
            }
            formData.append("group_image", values.group_image);
            const { data } = await apiRequest.updateGroup(formData);
            if (!data.success) throw data.message;
            toast.success('Group updated successfully');
            navigate('/send');
        }
    })

    const getGroupDetail = async (id) => {
        try {
          const { data } = await apiRequest.getGroupDetail({ group_id: id });
          if (!data.success || data.data === null) throw data.message;
          setGroupDetail(data.data.group_details);
          formik.setValues({'group_id' : data.data.group_details.group_id,'group_name' : data.data.group_details.group_name,'group_image' : data.data.group_details.group_image,'contact' : []});
          setProfileImage(data.data.group_details.group_image)
          setContactList(data.data.group_details.group_member_details);
        } catch (error) {
          if (error === "Contact not found") {
            setGroupDetail(null);
            setContactList(null);
          }
        }
    };

    const deleteGroupData = () => {
        setShowDeleteGroupPopup(true);
    }

    const deleteGroup = async (id) => {
        try {
            var param = {"group_id" : id};
            const { data } = await apiRequest.deleteGroup(param);
            if (!data.success) throw data.message;
            setShowDeleteGroupPopup(false);
            navigate('/send');
        }catch (error) {

        }
    }
    
    useEffect(() => {
        getGroupDetail(id);
    }, []);

    return (
        <div className="edit-group-section-main">
            <form onSubmit={formik.handleSubmit} className="save-group-form">
                <div className="edit-group-top-main text-center">
                    <div className="eg-profile-wrap">
                        <InputFile
                            id="_upPersonal"
                            name="profile_image"
                            onChange={(e) => {
                                console.log();
                                if(e.currentTarget.files[0] != undefined){
                                    formik.setFieldValue(
                                        "group_image",
                                        e.currentTarget.files[0]
                                    );
                                }
                            }}
                            error={formik.errors.group_image}
                            showPreview={
                                profileImage
                                    ? profileImage
                                    : "/assets/images/group-icon-image.png"
                            }
                            showLabel={false}
                            previewSrc={
                                profileImage
                                    ? profileImage
                                    : "/assets/images/group-icon-image.png"
                            }
                            fallbackSrc={
                                profileImage
                                    ? profileImage
                                    : "/assets/images/group-icon-image.png"
                            }
                            classNameInput="d-none"
                            classNameBorder={`overflow-visible group-icon-image ${styles.set_group_background_image}`}
                            classNameImage={`${styles.set_group_image}`}
                        />
                    </div>
                    <h3>Edit Group</h3>
                    <p className="eg-add-gi-wrap">
                        <label
                            htmlFor="fileInput_upPersonal"
                            className="cursor-pointer"
                            style={{ color: "#0081c5" }}
                        >
                            Add Group Image
                        </label>
                    </p>
                    <div className="form-field">
                        <Input type="text" className="form-control" 
                            placeholder="Group Name" name="group_name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.group_name}
                            error={
                                formik.touched.group_name &&
                                formik.errors.group_name
                            }
                        />
                    </div>
                </div>
                <EditGroupList 
                    data={contactList}
                    groupId={id}
                    selectedItems={(items) => formik.setFieldValue("contact" , items)}
                />
                <div className="edit-group-bottom-main text-center">
                    <div>
                        <input type="submit"
                        className={`btn btn-primary ${
                            formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                        }`}
                        disabled={formik.isSubmitting}
                        value="Save Group"
                        />
                    </div>
                    <a className="eg-del-grp"href="#" onClick={deleteGroupData}>Delete Group</a>
                </div>
            </form>
            <ModalConfirmation
                id="create-group-popup"
                show={showDeleteGroupPopup}
                setShow={setShowDeleteGroupPopup}
                heading = "Delete Group"
                subHeading = {`Are you sure want to delete ${formik.values.group_name}?`}
                handleCallback = {() => deleteGroup(id) }
                >
            </ModalConfirmation>
        </div>
    )
}