import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { IconSend, IconEdit, IconPlus } from "styles/svgs";
import { useNavigate } from "react-router-dom";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import Button from "components/ui/Button";
import ContactCard from "components/cards/ContactCard";
import { SendPaymentContext } from "context/sendPaymentContext";
import LoaderSendContact from "loaders/LoaderSendContact";
import LoaderSendContactButtons from "loaders/LoaderSendContactButtons";
import { toast } from "react-toastify";

function SendContact() {
  const [contactsList, setContactsList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  // For selected contacts || group
  const [selectedContactsIds, setSelectedContactsIds] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  // For total present data in List
  const [totalGroupData, setTotalGroupData] = useState(0);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  // For current page counts
  const [currentPage, setCurrentPage] = useState(1);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  // For Search Inputs in both list header
  const [searchGroupText, setSearchGroupText] = useState("");
  const [searchContactText, setSearchContactText] = useState("");
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
      if (!data.success) throw data.message;
      const appContacts = data?.data?.app_contacts || [];
      const cList = page === 1 ? appContacts : contactsList.concat(appContacts);
      const selecteds = selectedContacts?.map((item) => item?.account_number);
      setSelectedContactsIds(selecteds);
      setTotalInvitedData(data.data?.pagination?.total);
      setContactsList(cList);
    } catch (error) {
      setTotalInvitedData(0);
      setContactsList([]);
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
      const groups = data?.data?.groups || [];
      const gList = page === 1 ? groups : groupList.concat(groups);
      const selecteds = selectedGroup?.map((item) =>
        item?.group_id?.toString()
      );
      setSelectedGroupIds(selecteds);
      setTotalGroupData(data.data?.pagination?.total);
      setGroupList(gList);
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

  const handleReachEndContacts = async () => {
    if (currentPage * 10 < totalInvitedData) {
      setCurrentPage((cp) => cp + 1);
      await getInviteContactList(currentPage + 1, searchContactText);
    }
  };

  const handleReachEndGroups = async () => {
    if (groupCurrentPage * 10 < totalGroupData) {
      setGroupCurrentPage((cp) => cp + 1);
      await getGroupsList(groupCurrentPage + 1, searchGroupText);
    }
  };

  const handleEditGroup = () => {
    if (!selectedGroupIds || selectedGroupIds.length <= 0) {
      toast.warning("Please select at least one group");
      return;
    }
    navigate("/edit-group/" + selectedGroupIds[0]);
  };

  // handle selected contacts
  const handleSelectContact = (e) => {
    const value = e?.currentTarget?.value;
    const checked = e?.currentTarget?.checked;
    let updatedIds = [...selectedContactsIds];
    if (!value) return;
    if (checked) updatedIds = [...selectedContactsIds, value];
    else updatedIds.splice(selectedContactsIds.indexOf(value), 1);
    setSelectedContactsIds(updatedIds);
    const sconts = contactsList.filter((item) =>
      updatedIds.includes(item?.account_number)
    );
    handleSelectedContacts && handleSelectedContacts(sconts);
  };

  // handle selected group
  const handleSelectGroup = (e) => {
    const value = e?.currentTarget?.value;
    const checked = e?.currentTarget?.checked;
    if (!value) return;
    if (checked) setSelectedGroupIds([value]);
    else setSelectedGroupIds([]);
    const sgrps = checked
      ? groupList.filter((item) => item.group_id.toString() === value)
      : [];
    handleSelectedGroup && handleSelectedGroup(sgrps);
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
        <ContactsSelection.Body
          isLoading={isLoadingContacts}
          classNameContainer="send-group-slider"
          contacts={contactsList}
          selectedContacts={selectedContactsIds}
          handleSelectedItems={handleSelectContact}
          handleReachEnd={handleReachEndContacts}
          fullWidth={true}
          emptyListMsg="Contact not found"
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
        <ContactsSelection.Footer>
          {isLoadingContacts ? (
            <LoaderSendContactButtons />
          ) : contactsList.length > 0 ? (
            <Button
              className="btn btn-next ws--btn ms-0"
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

        <ContactsSelection.Body
          isLoading={isLoadingGroups}
          classNameContainer="send-group-slider"
          contacts={groupList}
          selectedContacts={selectedGroupIds}
          handleSelectedItems={handleSelectGroup}
          handleReachEnd={handleReachEndGroups}
          fullWidth={true}
          emptyListMsg="Group not found"
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
        <ContactsSelection.Footer>
          {isLoadingContacts ? (
            <LoaderSendContactButtons />
          ) : (
            <>
              <Button
                type="button"
                className="btn btn-cancel-payment"
                onClick={handleEditGroup}
              >
                <IconEdit style={{ stroke: "#0081c5" }} />
                Edit
              </Button>
              <Button
                type="button"
                className="btn btn-next ws--btn"
                onClick={handleSendGroup}
              >
                <IconSend style={{ stroke: "#fff" }} />
                Send
              </Button>
            </>
          )}
        </ContactsSelection.Footer>
      </ContactsSelection>
    </div>
  );
}

export default SendContact;
