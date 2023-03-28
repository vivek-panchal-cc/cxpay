import Input from "components/ui/Input";
import React, { useState,useEffect, useRef } from "react";
import { IconSearch } from "styles/svgs";
import styles from "./modal.module.scss";
import "./contactList.css";
import { apiRequest } from "helpers/apiRequests";

function ContactListingModal(props) {
    const {
        className,
        id,
        show,
        setShow,
        handleCallback,
        groupId,
        selectedItem,
        selectedFullItem,
        alldata
    } = props;
    const modalRef = useRef(null);
    const [remainingContactListing, setRemainingContactListing] = useState([]);
    const [selectedRemainingContact, setSelectedRemainingContact] = useState([]);
    const [selectedFullContactArray, setSelectedFullContactArray] = useState([]);
    const [searchContactName, setSearchContactName] = useState("");
    const [currentListPage, setCurrentListPage] = useState(1);
    const [listingTotalData, setListingTotalData] = useState(0);
    var getCurrentData = alldata.filter(item => selectedRemainingContact.includes(item.member_mobile_number));
    getCurrentData = getCurrentData.map((item) => item.member_mobile_number);
    const searchContactData = (e) => {
        setSearchContactName(e.target.value);
        retriveRemainingContact(1,e.target.value);
        setCurrentListPage(1);
    }
    
    const handleResetContactData = () => {
        setSearchContactName('');
        setCurrentListPage(1);
        retriveRemainingContact(1,'');
    }

    const submitContactData = () =>{
        let difference = selectedRemainingContact.filter(x => !getCurrentData.includes(x));
        let selectedFullArrayDifference = selectedFullContactArray.filter(item => difference.includes(item.member_mobile_number));
        selectedFullItem(selectedFullArrayDifference);
        selectedItem(selectedRemainingContact)
        handleCallback(false);
    }

    const handleChange = async(e) => {
        const checked = e.target.checked;
        var value = e.target.value
        let selectedArray = []
        if(checked){
            selectedArray = [...selectedRemainingContact, value];
        }else{
            selectedArray = selectedRemainingContact.filter((elm) => elm !== value);
        }
        var fullArray = remainingContactListing.filter(item => selectedArray.includes(item.member_mobile_number));
        setSelectedRemainingContact(selectedArray);
        setSelectedFullContactArray(fullArray)
    }
    const onScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) { 
            if(currentListPage*10 < listingTotalData){
                setCurrentListPage(currentListPage + 1);
                retriveRemainingContact(currentListPage + 1,searchContactName);
            }
        }
    }

    const retriveRemainingContact = async(page,searchText) =>{
        try {
            const { data } = await apiRequest.getRemainingGroupContact({ group_id: groupId,page : page,search : searchText});
            if (!data.success) throw data.message;
            setListingTotalData(data.data.pagination.total); 
            if (page == 1) {
                setRemainingContactListing(data.data.remain_contacts)
            } else {
                var allData = remainingContactListing.concat(data.data.remain_contacts);
                setRemainingContactListing(allData);
            }
        }catch(error){
        }
    }
    
    useEffect(() => {
        if(show){
            retriveRemainingContact(currentListPage,searchContactName);
        }
        function handleclickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShow(false);
            }
        }
        document.addEventListener("mousedown", handleclickOutside);
        return () => {
            document.removeEventListener("mousedown", handleclickOutside);
        };
    }, [modalRef, setShow,show]);

    if (!show) return null;
    return (
        <div
            className={`modal fade show ${styles.modal} ${className}`}
            id={id}
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="con-md-search-wrap">
                            <form name="sdsa">
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
                                    <Input type="search" className="form-control js-searchBox-input" name="search-field" placeholder="Search..." onChange={searchContactData} />
                                        <div className="search-btn">
                                            <IconSearch />
                                        </div>
                                </div>
                            </form>
                            <div className="con-md-del-wrap">
                                <a href="#" className="btn btn-primary con-md-delbtn" onClick={submitContactData}>Add</a>
                            </div>
                        </div>
                        <div className="cml-container">
                            <ul onScroll={onScroll}>
                                {(remainingContactListing.length > 0 ? remainingContactListing.map((ele) => (
                                    <li key={"li-"+ele.member_mobile_number}>
                                        <div className="modal-contact-list-wrap">
                                            <div className="cm-listing-check">
                                                <input id={ele.member_mobile_number} type="checkbox" value={ele.member_mobile_number} onChange={handleChange} checked={selectedRemainingContact.includes(ele.member_mobile_number)} />
                                                <label htmlFor={ele.member_mobile_number}>{ele.member_name}</label>
                                            </div>
                                        </div>
                                    </li>
                                )) : 'No contacts found')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactListingModal;
