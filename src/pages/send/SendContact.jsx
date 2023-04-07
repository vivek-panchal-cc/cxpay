import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { IconSend, IconEdit, IconPlus } from "styles/svgs";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "context/loaderContext";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import Button from "components/ui/Button";
import ContactCard from "components/cards/ContactCard";
import { SendPaymentContext } from "context/sendPaymentContext";

function SendContact() {
  const [inviteContactList, setInviteContactList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [totalGroupData, setTotalGroupData] = useState(0);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [deleteGroupName, setDeleteGroupName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { setIsLoading } = useContext(LoaderContext);

  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const navigate = useNavigate();
  const {
    handleSelectedContacts,
    handleSelectedGroup,
    handleSendContacts,
    handleSendGroup,
  } = useContext(SendPaymentContext);

  const navigateToContactScreen = () => {
    navigate("/contacts");
  };

  const handleResetContactData = () => {
    setSearchText("");
    setCurrentPage(1);
    getInviteContactList(1, "");
  };

  const handleResetGroupData = () => {
    setSearchData("");
    setGroupCurrentPage(1);
    getGroupsList(1, "");
  };

  const getInviteContactList = async (page, search) => {
    setIsLoading(true);
    try {
      let param = { page: page, search: search };
      const { data } = await apiRequest.getInviteContactList(param);
      if (!data.success) throw data.message;
      setTotalInvitedData(data.data.pagination.total);
      if (page === 1) {
        setInviteContactList(data.data.app_contacts);
      } else {
        var allData = inviteContactList.concat(data.data.app_contacts);
        setInviteContactList(allData);
      }
      setIsLoading(false);
    } catch (error) {
      setTotalInvitedData(0);
      setInviteContactList([]);
      setIsLoading(false);
    }
  };

  const getGroupsList = async (page, searchText) => {
    setIsLoading(true);
    try {
      var param = { page: page, search: searchText };
      const { data } = await apiRequest.getGroupsList(param);
      if (!data.success) throw data.message;
      setTotalGroupData(data.data.pagination.total);
      if (page === 1) {
        setGroupList(data.data.groups);
      } else {
        var allData = groupList.concat(data.data.groups);
        setGroupList(allData);
      }
      setIsLoading(false);
    } catch (error) {
      setTotalGroupData(0);
      setGroupList([]);
      setIsLoading(false);
    }
  };

  const getSearchContact = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
    getInviteContactList(1, e.target.value);
  };

  const getSearchGroup = (e) => {
    setSearchData(e.target.value);
    setGroupCurrentPage(1);
    getGroupsList(1, e.target.value);
  };

  const checkedCheckBoxData = (e) => {
    if (selectedContacts.length === 0) {
      toast.warning("Please select at least one contact");
    } else {
      console.log(selectedContacts);
    }
  };

  const checkGroupSelected = (flag) => {
    if (selectedGroup.length > 0) {
      if (flag === 1) {
        navigate("/edit-group/" + selectedGroup[0]);
      } else if (flag === 2) {
        handleDeleteConfirmation(selectedGroup[0]);
        const filtered = groupList.filter((group) => {
          return group.group_id === selectedGroup[0];
        });
        setDeleteGroupName(filtered[0].group_name);
      } else if (flag === 3) {
        console.log(selectedGroup);
      }
    } else {
      toast.warning("Please select at least one group");
    }
  };

  const handleDeleteConfirmation = (groupId) => {
    setDeleteGroupId(groupId);
    setDeleteGroupName();
    setShowDeleteGroupPopup(true);
  };

  const deleteGroup = async (id) => {
    setIsLoading(true);
    try {
      var param = { group_id: id };
      const { data } = await apiRequest.deleteGroup(param);
      if (!data.success) throw data.message;
      setGroupCurrentPage(1);
      setGroupList([]);
      getGroupsList(1, searchData);
      setShowDeleteGroupPopup(false);
      setIsLoading(false);
      toast.success(data.message);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleReachEndContacts = () => {
    if (currentPage * 10 < totalInvitedData) {
      setCurrentPage(currentPage + 1);
      getInviteContactList(currentPage + 1, searchText);
    }
  };

  const handleReachEndGroups = () => {
    if (groupCurrentPage * 10 < totalGroupData) {
      setGroupCurrentPage(groupCurrentPage + 1);
      getGroupsList(groupCurrentPage + 1, searchData);
    }
  };

  const handleEditGroup = () => {
    console.log(selectedGroup);
    navigate("/edit-group/" + selectedGroup[0].group_id);
  };

  useEffect(() => {
    getInviteContactList(currentPage, searchText);
    getGroupsList(groupCurrentPage, searchData);
  }, []);

  return (
    <div className="send-bottom-sec">
      {/* Contacts Selection Component  ----- For Personal Contacts Selection */}
      <ContactsSelection className="col-12">
        <ContactsSelection.Header
          className=""
          heading="For whom to send?"
          subHeading="Please select contacts to whom you want to send money"
          handleSearch={getSearchContact}
        />
        <ContactsSelection.Body
          classNameContainer="send-group-slider"
          contacts={inviteContactList}
          fullWidth={true}
          isMultiSelect={true}
          handleReachEnd={handleReachEndContacts}
          emptyListMsg="Contact not found"
          handleSelectedItems={handleSelectedContacts}
          ListItemComponent={ContactCard}
          ListItemComponentProps={{
            fullWidth: true,
            isSelectable: true,
            fallbackImgUrl: "assets/images/profile-default.svg",
          }}
          ListItemComponentAlias={{
            account_number: "id",
            name: "title",
            profile_image: "imgUrl",
          }}
        />
        <ContactsSelection.Footer>
          {inviteContactList.length > 0 ? (
            <Button
              className="btn btn-next ws--btn"
              onClick={handleSendContacts}
            >
              <IconSend style={{ stroke: "#fff" }} />
              Send
            </Button>
          ) : (
            <Button
              className="btn btn-next ms-0"
              onClick={navigateToContactScreen}
            >
              <IconPlus style={{ stroke: "#fff" }} />
              Add Contact
            </Button>
          )}
        </ContactsSelection.Footer>
      </ContactsSelection>

      {/* Contacts Selection Component  ----- For Contacts Group Selection */}
      <ContactsSelection className="col-12">
        <ContactsSelection.Header
          className=""
          heading="Groups"
          subHeading=""
          handleSearch={getSearchGroup}
        />
        <ContactsSelection.Body
          classNameContainer="send-group-slider"
          contacts={groupList}
          fullWidth={true}
          isMultiSelect={false}
          handleReachEnd={handleReachEndGroups}
          emptyListMsg="Group not found"
          handleSelectedItems={handleSelectedGroup}
          ListItemComponent={ContactCard}
          ListItemComponentProps={{
            fullWidth: true,
            isSelectable: true,
            fallbackImgUrl: "assets/images/group-payment-black-icon.png",
          }}
          ListItemComponentAlias={{
            group_id: "id",
            group_name: "title",
            group_image: "imgUrl",
          }}
        />
        <ContactsSelection.Footer>
          <Button className="btn btn-cancel-payment" onClick={handleEditGroup}>
            <IconEdit style={{ stroke: "#0081c5" }} />
            Edit
          </Button>
          <Button className="btn btn-next ws--btn" onClick={handleSendGroup}>
            <IconSend style={{ stroke: "#fff" }} />
            Send
          </Button>
        </ContactsSelection.Footer>
      </ContactsSelection>

      {/* Confirmation Modal for delete Group */}
      <ModalConfirmation
        id="create-group-popup"
        show={showDeleteGroupPopup}
        setShow={setShowDeleteGroupPopup}
        heading="Delete Group"
        subHeading={`Are you sure want to delete ${deleteGroupName}?`}
        handleCallback={() => deleteGroup(deleteGroupId)}
      ></ModalConfirmation>
    </div>
  );
}

export default SendContact;
