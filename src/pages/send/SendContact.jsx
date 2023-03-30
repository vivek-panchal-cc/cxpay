import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import ContactList from "components/contacts-list/ContactList";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { IconSearch, IconSend, IconEdit } from "styles/svgs";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "context/loaderContext";

export default function SendContact() {
  const [inviteContactList, setInviteContactList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [totalGroupData, setTotalGroupData] = useState(0);
  const [groupCurrentPage, setGroupCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState("");
  const [deleteGroupName, setDeleteGroupName] = useState("");

  const [selectedContactList, setSelectedContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

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
    if (selectedContactList.length === 0) {
      toast.warning("Please select at least one contact");
    } else {
      console.log("Process Here!!!!!");
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

  useEffect(() => {
    getInviteContactList(currentPage, searchText);
    getGroupsList(groupCurrentPage, searchData);
  }, []);

  return (
    <div className="send-bottom-sec">
      <div className="send-inner-sec col-12">
        <div className="send-top-sec">
          <div className="title-content-wrap">
            <h3>For whom to send?</h3>
            <p>Please select contacts to whom you want to send money</p>
          </div>
          <form style={{ width: "40%", marginTop: "15px" }}>
            <div className="form-field search-field">
              <div
                className="js-clearSearchBox clearsearchbox"
                onClick={handleResetContactData}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1L0.999999 13"
                    stroke="#9B9B9B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M1 1L13 13"
                    stroke="#9B9B9B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <Input
                type="search"
                className="form-control js-searchBox-input"
                name="search-field"
                placeholder="Search..."
                onChange={getSearchContact}
              />
              <div className="search-btn">
                <IconSearch />
              </div>
            </div>
          </form>
        </div>
        {inviteContactList.length > 0 ? (
          <ContactList
            data={inviteContactList}
            fullWidth={true}
            containerClassName={"send-group-slider"}
            isSelectable={true}
            selectedItems={(items) => setSelectedContactList(items)}
            onReachEnd={() => {
              if (currentPage * 10 < totalInvitedData) {
                setCurrentPage(currentPage + 1);
                getInviteContactList(currentPage + 1, searchText);
              }
            }}
          />
        ) : (
          <div className="loading">
            <p className="loading-data">No data found</p>
          </div>
        )}
        <div className="login-btn">
          <div className="setting-btn-link send-btn-wrap pay-btn-wrap pt-3">
            <button
              className="btn btn-next ms-0"
              onClick={checkedCheckBoxData}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {/* <hr /> */}
      <div className="send-top-sec">
        <div className="title-content-wrap">
          <h3>Groups</h3>
          {/* <p>Please select group to whom you want to send money</p> */}
        </div>
        {/* <div className="send-top-right-sec">
                    <div className="main-search-wrap"> */}
        <form style={{ width: "40%", marginTop: "0px" }}>
          <div className="form-field search-field">
            <div
              className="js-clearSearchBox clearsearchbox"
              onClick={handleResetGroupData}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 1L0.999999 13"
                  stroke="#9B9B9B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M1 1L13 13"
                  stroke="#9B9B9B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
            <Input
              type="search"
              className="form-control js-searchBox-input"
              name="search-field"
              placeholder="Search..."
              onChange={getSearchGroup}
            />
            <div className="search-btn">
              <IconSearch />
            </div>
          </div>
        </form>
        {/* </div>
                </div> */}
      </div>
      {groupList.length > 0 ? (
        <ContactList
          data={groupList}
          fullWidth={true}
          containerClassName={"send-group-slider"}
          isSelectable={true}
          selectedItems={(items) => setSelectedGroup(items)}
          onReachEnd={() => {
            console.log(totalGroupData);
            if (groupCurrentPage * 10 < totalGroupData) {
              setGroupCurrentPage(groupCurrentPage + 1);
              getGroupsList(groupCurrentPage + 1, searchData);
            }
          }}
          isMultiSelect={false}
        />
      ) : (
        <div className="loading">
          <p className="loading-data">{searchData != '' ? 'Group not found' : 'No data found'}</p>
        </div>
      )}
      <div className="send-btn-wrap pay-btn-wrap pt-2">
        <a
          className="btn btn-cancel-payment"
          onClick={(e) => checkGroupSelected(1)}
        >
          <IconEdit style={{ stroke: "#0081c5" }} /> Edit
        </a>
        {/* <a className="btn btn-next" onClick={(e) => checkGroupSelected(2)}>
          Delete
        </a> */}
        <a
          className="btn btn-next ws--btn"
          onClick={(e) => checkGroupSelected(3)}
        >
          <IconSend style={{ stroke: "#fff" }} /> Send{" "}
        </a>
      </div>
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
