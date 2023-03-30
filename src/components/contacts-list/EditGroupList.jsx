import React, { useContext, useEffect, useState } from "react";
import { A11y, Navigation, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ModalConfirmation from "components/modals/ModalConfirmation";
import AddContactData from "components/modals/ContactListingModal";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router";
import { LoaderContext } from "context/loaderContext";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const EditGroupList = (props) => {
  const { data, groupId, selectedItems,getItem, fullWidth = false } = props;
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);
  const [showAddContactPopup, setShowAddContactPopup] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(0);
  const [deleteMobileNumber, setDeleteMobileNumber] = useState(0);
  const [contactsList, setContactsList] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    if (data) setContactsList(data);
  }, [data]);

  const breakpoints = fullWidth
    ? {
        1300: {
          slidesPerView: 6,
          spaceBetween: 28,
        },
        1199: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        0: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
      }
    : {
        1380: {
          slidesPerView: 7,
          spaceBetween: 12,
        },
        1199: {
          slidesPerView: 5,
          spaceBetween: 12,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        650: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        575: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        0: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      };

  const showAddContactPopupData = () => {
    setShowAddContactPopup(true);
  };

  const memberDeleteConfirmation = (
    memberAccountNumber,
    memberMobileNumber
  ) => {
    setDeleteMemberId(memberAccountNumber);
    setDeleteMobileNumber(memberMobileNumber);
    if (contactsList.length === 1) {
      setShowDeleteGroupPopup(true);
    } else {
      //setShowDeletePopup(true);
      deleteMember(memberAccountNumber, memberMobileNumber);
    }
  };
  const deleteCurrentGroup = async (id) => {
    await apiRequest.deleteGroup({ group_id: id });
    setShowDeleteGroupPopup(false);
    setIsLoading(false);
    toast.success("Group deleted successfully.");
    navigate("/send");
  };

  const deleteMemberWithGroup = async (memberAccountNumber) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteGroupMember({
        group_id: groupId,
        member_account_number: [memberAccountNumber],
      });
      if (!data.success) throw data.message;
      var contactData = contactsList.filter(
        (obj) => obj.member_account_number !== memberAccountNumber
      );
      setContactsList(contactData);
      //selectedItems(contactData);
      deleteCurrentGroup(groupId);
    } catch (error) {
      setShowDeleteGroupPopup(false);
      setIsLoading(false);
    }
  };

  const deleteMember = async (memberAccountNumber, memberMobileNumber) => {
    console.log(getItem);
    console.log(memberMobileNumber);
    if (memberAccountNumber !== "undefined") {
      try {
        const { data } = await apiRequest.deleteGroupMember({
          group_id: groupId,
          member_account_number: [memberAccountNumber],
        });
        if (!data.success) throw data.message;
        var contactData = contactsList.filter(
          (obj) => obj.member_account_number !== memberAccountNumber
        );
        setContactsList(contactData);
        setShowDeletePopup(false);
      } catch (error) {
        setShowDeletePopup(false);
      }
    } else {
      var contactData = contactsList.filter(
        (obj) => obj.member_mobile_number !== memberMobileNumber
      );
      setContactsList(contactData);
      setShowDeletePopup(false);
    }
    var index = getItem.indexOf(memberMobileNumber);
    if (index > -1) { // only splice array when item is found
      getItem.splice(index, 1); // 2nd parameter means remove one item only
    }
    selectedItems(getItem);
  };

  return (
    <div className="edit-group-slider-main">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={fullWidth}
        breakpoints={breakpoints}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        //onReachEnd = {onReachEnd}
      >
        <div className="swiper-wrapper">
          {contactsList?.map((elm, i) => (
            <SwiperSlide key={"swiper" + i}>
              <div className="eg-wrap-main">
                <a
                  className="eg-close-btn"
                  onClick={(e) =>
                    memberDeleteConfirmation(
                      `${elm.member_account_number}`,
                      `${elm.member_mobile_number}`
                    )
                  }
                >
                  <img src="/assets/images/cross-red.svg" alt="" />
                </a>
                <div className="grp-img-wrap">
                  <img
                    src={
                      elm.member_profile_image
                        ? elm.member_profile_image
                        : "/assets/images/profile-default.svg"
                    }
                    style={
                      elm.member_profile_image ? {} : { objectFit: "none" }
                    }
                    alt=""
                  />
                </div>
                <p>{elm.member_name}</p>
              </div>
            </SwiperSlide>
          ))}
        </div>
        <div className="eg-add-con-wrap">
          <a onClick={() => showAddContactPopupData()} className="custom-link-color">
            + Add Contact
          </a>
        </div>
      </Swiper>
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showDeletePopup}
        setShow={setShowDeletePopup}
        heading="Delete Member"
        subHeading="Are you sure want to delete a member?"
        handleCallback={() => deleteMember(deleteMemberId, deleteMobileNumber)}
      ></ModalConfirmation>

      <ModalConfirmation
        id="delete-group-popup-with-member"
        show={showDeleteGroupPopup}
        setShow={setShowDeleteGroupPopup}
        heading="Delete Last Member"
        subHeading="Are you sure want to delete a member and group?"
        handleCallback={() => deleteMemberWithGroup(deleteMemberId)}
      ></ModalConfirmation>

      <AddContactData
        id="delete-group-popup"
        show={showAddContactPopup}
        setShow={setShowAddContactPopup}
        handleCallback={() => setShowAddContactPopup(false)}
        className={`con-list-pop`}
        groupId={groupId}
        selectedItem={(item) => selectedItems(item)}
        alldata={contactsList}
        selectedFullItem={(item) => setContactsList([...contactsList, ...item])}
        getItem={getItem}
      ></AddContactData>
    </div>
  );
};
export default EditGroupList;
