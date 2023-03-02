import ModalConfirmation from "components/modals/ModalConfirmation";
import { THEME_COLORS } from "constants/all";
import { apiRequest } from "helpers/apiRequests";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IconBank, IconCross } from "styles/svgs";

const BankList = () => {
  const [bankList, setBankList] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    getBankList();
  }, []);

  const getBankList = async () => {
    try {
      const { data } = await apiRequest.getBankList();
      setBankList(data.data?.banks);
      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOpenConfirmModal = (id) => {
    setSelectedBank(id);
    setShow(true);
  };
  const handleDeleteBank = async () => {
    const id = selectedBank;
    try {
      const { data } = await apiRequest.deleteBank({ id });
      if (data.success) {
        toast.success(data.message);
        getBankList();
        setSelectedBank("");
        setShow(false);
      }
      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const getCapitalized = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="">
      <div className="dashboard-search-wrap col-lg-7 col-12">
        <div className="title-content-wrap send-pay-title-sec title-common-sec">
          <h3>My Bank Accounts</h3>
          <p>Primary Bank Accounts</p>
        </div>
      </div>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {bankList?.map((elm, i) => (
              <li
                key={"list" + elm?.bank_number}
                className="db-view-bank-div-main db-view-bank-common-div"
              >
                <div className="bank-logo-name-wrap">
                  <div
                    className="bank-logo-wrap"
                    bg-color={THEME_COLORS[i % THEME_COLORS.length]}
                  >
                    <IconBank />
                  </div>
                  <p className="bank-name-wrap">{elm?.bank_name}</p>
                </div>
                <div className="bank-account-num-wrap">
                  <span>{elm?.bank_number}</span>
                </div>

                <div className="bank-account-num-wrap">
                  <span>{elm?.routing_number}</span>
                </div>
                <div className="bank-account-date-wrap">
                  {getCapitalized(elm?.account_type) + " Account"}
                </div>
                <div className="bank-account-date-wrap"></div>
                {/* <div className="bank-bal-wrap">Balance : <span>0</span></div> */}
                <div
                  className="bank-del-wrap"
                  onClick={() => handleOpenConfirmModal(elm.id)}
                >
                  <IconCross style={{ stroke: "#9B9B9B" }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="view_bank_listing_bottom-wrap">
        <Link to="/wallet/link-bank">+ Add Bank Account</Link>
      </div>
      <ModalConfirmation
        heading={"Confirm!"}
        subHeading={"Are you sure you want to delete this bank?"}
        show={show}
        setShow={setShow}
        handleCallback={handleDeleteBank}
      />
    </div>
  );
};

export default BankList;
