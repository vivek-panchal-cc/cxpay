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
                retriveRemainingContact(currentListPage + 1);
            }
        }
    }

    const retriveRemainingContact = async(page) =>{
        try {
            const { data } = await apiRequest.getRemainingGroupContact({ group_id: groupId,page : page});
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
            retriveRemainingContact(currentListPage);
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
                                {(remainingContactListing.length > 0 ? remainingContactListing?.filter((item)=> item.member_name.toLowerCase().startsWith(searchContactName.toLowerCase()) && !getCurrentData.includes(item.member_mobile_number)).map((ele) => (
                                    <li key={"li-"+ele.member_mobile_number}>
                                        <div className="modal-contact-list-wrap">
                                            <div className="cm-listing-check">
                                                <input id={ele.member_mobile_number} type="checkbox" value={ele.member_mobile_number} onChange={handleChange} checked={selectedRemainingContact.includes(ele.member_mobile_number)} />
                                                <label htmlFor={ele.member_mobile_number}>{ele.member_name}</label>
                                            </div>
                                        </div>
                                    </li>
                                )) : '')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactListingModal;
