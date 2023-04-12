import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconSend, IconEdit, IconPlus } from "styles/svgs";
import { useNavigate } from "react-router-dom";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import Button from "components/ui/Button";
import ContactCard from "components/cards/ContactCard";
import { SendPaymentContext } from "context/sendPaymentContext";
import LoaderSendContact from "loaders/LoaderSendContact";

function SendContact() {
  const [inviteContactList, setInviteContactList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [totalGroupData, setTotalGroupData] = useState(0);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  // For Search Inputs in both list header
  const [searchContactText, setSearchContactText] = useState("");
  const [searchGroupText, setSearchGroupText] = useState("");
  // Loaders
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const navigate = useNavigate();
  const {
    handleSelectedContacts,
    handleSelectedGroup,
    handleSendContacts,
    handleSendGroup,
    selectedContacts,
    selectedGroup,
  } = useContext(SendPaymentContext);

  const navigateToContactScreen = () => {
    navigate("/contacts");
  };

  const handleResetContactData = () => {
    setSearchContactText("");
    setCurrentPage(1);
    getInviteContactList(1, "");
  };

  const handleResetGroupData = () => {
    setSearchGroupText("");
    setGroupCurrentPage(1);
    getGroupsList(1, "");
  };

  const getInviteContactList = async (page, search) => {
    setIsLoadingContacts(true);
    try {
      let param = { page: page, search: search };
      const { data } = await apiRequest.getInviteContactList(param);
      console.log("THIS IS THE END", data);
      if (!data.success) throw data.message;
      setTotalInvitedData(data.data?.pagination?.total);
      if (page === 1) {
        setInviteContactList(data.data?.app_contacts);
      } else {
        var allData = [...inviteContactList].concat(data.data?.app_contacts);
        setInviteContactList(allData);
      }
    } catch (error) {
      setTotalInvitedData(0);
      setInviteContactList([]);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const getGroupsList = async (page, searchText) => {
    setIsLoadingGroups(true);
    try {
      var param = { page: page, search: searchText };
      const { data } = await apiRequest.getGroupsList(param);
      if (!data.success) throw data.message;
      setTotalGroupData(data.data?.pagination?.total);
      if (page === 1) {
        setGroupList(data.data?.groups);
      } else {
        var allData = [...groupList].concat(data.data?.groups);
        setGroupList(allData);
      }
    } catch (error) {
      setTotalGroupData(0);
      setGroupList([]);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  // For searching the contacts with name given in search bar
  const handleSearchContact = (e) => {
    setSearchContactText(e.target.value);
  };

  // For searching the groups with name given in search bar
  const handleSearchGroup = (e) => {
    setSearchGroupText(e.target.value);
  };

  const handleReachEndContacts = () => {
    if (currentPage * 10 < totalInvitedData) {
      setCurrentPage(currentPage + 1);
      getInviteContactList(currentPage + 1, searchContactText);
    }
  };

  const handleReachEndGroups = () => {
    if (groupCurrentPage * 10 < totalGroupData) {
      setGroupCurrentPage(groupCurrentPage + 1);
      getGroupsList(groupCurrentPage + 1, searchGroupText);
    }
  };

  const handleEditGroup = () => {
    if (!selectedGroup || !selectedGroup[0]?.group_id) return;
    navigate("/edit-group/" + selectedGroup[0]?.group_id);
  };

  // Debouncing for contacts
  useEffect(() => {
    if (searchContactText === "") {
      getInviteContactList(1, searchContactText);
      return;
    }
    const timeOut = setTimeout(() => {
      setCurrentPage(1);
      getInviteContactList(1, searchContactText);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [searchContactText]);

  // Debouncing for groups
  useEffect(() => {
    if (searchGroupText === "") {
      getGroupsList(1, searchGroupText);
      return;
    }
    const timeOut = setTimeout(() => {
      setGroupCurrentPage(1);
      getGroupsList(1, searchGroupText);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [searchGroupText]);

  return (
    <div className="send-bottom-sec">
      {/* Contacts Selection Component  ----- For Personal Contacts Selection */}
      <ContactsSelection className="col-12">
        <ContactsSelection.Header
          className=""
          heading="For whom to send?"
          subHeading="Please select contacts to whom you want to send money"
          searchValue={searchContactText}
          handleSearch={handleSearchContact}
          clearSearch={handleResetContactData}
        />
        {isLoadingContacts ? (
          <div
            className="d-inline-flex column-gap-4"
            style={{ paddingLeft: "40px" }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <LoaderSendContact />
            ))}
          </div>
        ) : (
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
              fallbackImgUrl: "assets/images/single_contact_profile.png",
            }}
            ListItemComponentAlias={{
              account_number: "id",
              name: "title",
              profile_image: "imgUrl",
            }}
          />
        )}
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
          searchValue={searchGroupText}
          handleSearch={handleSearchGroup}
          clearSearch={handleResetGroupData}
        />
        {isLoadingGroups ? (
          <div
            className="d-inline-flex column-gap-4"
            style={{ paddingLeft: "40px" }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <LoaderSendContact />
            ))}
          </div>
        ) : (
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
              fallbackImgUrl: "assets/images/group_contact_profile.png",
            }}
            ListItemComponentAlias={{
              group_id: "id",
              group_name: "title",
              group_image: "imgUrl",
            }}
          />
        )}
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
    </div>
  );
}

export default SendContact;
