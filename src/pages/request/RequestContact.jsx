import React, { useContext, useEffect, useState } from "react";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import ContactCard from "components/cards/ContactCard";
import { IconSend } from "styles/svgs";
import LoaderSendContactButtons from "loaders/LoaderSendContactButtons";
import Button from "components/ui/Button";
import { apiRequest } from "helpers/apiRequests";
import { SendPaymentContext } from "context/sendPaymentContext";
import ModalAddContact from "components/modals/ModalAddContact";

const RequestContact = (props) => {
  const {} = props;
  const { selectedContacts, handleSelectedContacts, handleSendRequest } =
    useContext(SendPaymentContext);
  const [contactsList, setContactsList] = useState([]);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [selectedContactsIds, setSelectedContactsIds] = useState([]);
  // Loaders
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  // For Search Inputs in both list header
  const [searchContactText, setSearchContactText] = useState("");
  // For current page counts
  const [currentPage, setCurrentPage] = useState(1);
  // For Add new contacts
  const [showNewContPop, setShowNewContPop] = useState(false);

  const getInviteContactList = async (page = 1, search = "") => {
    setIsLoadingContacts(true);
    try {
      let param = { page: page, search: search };
      const { data } = await apiRequest.getInviteContactList(param);
      if (!data.success) throw data.message;
      const appContacts = data?.data?.app_contacts || [];
      const cList = page === 1 ? appContacts : contactsList.concat(appContacts);
      setTotalInvitedData(data.data?.pagination?.total);
      setContactsList(cList);
    } catch (error) {
      setTotalInvitedData(0);
      setContactsList([]);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleResetContactData = () => {
    setSearchContactText("");
    setCurrentPage(1);
  };

  // For searching the contacts with name given in search bar
  const handleSearchContact = (e) => {
    setSearchContactText(e.target.value);
  };

  const handleReachEndContacts = async () => {
    if (currentPage * 10 < totalInvitedData) {
      setCurrentPage((cp) => cp + 1);
      await getInviteContactList(currentPage + 1, searchContactText);
    }
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

  // Pre-selecting contacts
  useEffect(() => {
    const selecteds = selectedContacts?.map((item) => item?.account_number);
    setSelectedContactsIds(selecteds);
  }, [contactsList, selectedContacts]);

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
  }, [searchContactText.toString().trim()]);

  return (
    <div className="send-bottom-sec">
      <ContactsSelection className="col-12">
        <ContactsSelection.Header
          className=""
          heading="For whom to request?"
          subHeading="Please select contacts to whom you want to request money"
          searchValue={searchContactText}
          handleSearch={handleSearchContact}
          clearSearch={handleResetContactData}
        >
          <div className="add-contact-btn-wrap">
            <button
              className="btn add-contact-btn"
              onClick={() => setShowNewContPop(true)}
            >
              Add New Contact
            </button>
          </div>
        </ContactsSelection.Header>
        <ContactsSelection.Body
          isLoading={isLoadingContacts}
          classNameContainer="send-group-slider"
          contacts={contactsList}
          selectedContacts={selectedContactsIds}
          handleSelectedItems={handleSelectContact}
          handleReachEnd={handleReachEndContacts}
          fullWidth={true}
          emptyListMsg="Contacts not found"
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
          ) : (
            contactsList.length > 0 && (
              <Button
                type="button"
                className="btn btn-next ws--btn ms-0"
                onClick={handleSendRequest}
              >
                <IconSend style={{ stroke: "#fff" }} />
                Request
              </Button>
            )
          )}
        </ContactsSelection.Footer>
      </ContactsSelection>
      <ModalAddContact
        id="add_contact"
        invitetitle="Add Contact"
        show={showNewContPop}
        setShow={setShowNewContPop}
        getConatcts={getInviteContactList}
        getInvitedConatcts={() => {}}
        setConatctData={() => {}}
        setInvitationSentPopup={() => {}}
        setConatctDetailPopup={() => {}}
        isNavigate={false}
      />
    </div>
  );
};

export default RequestContact;
