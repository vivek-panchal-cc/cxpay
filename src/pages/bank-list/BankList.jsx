import React, { useContext, useState, useEffect } from "react";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { THEME_COLORS } from "constants/all";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IconBank, IconCross } from "styles/svgs";

const BankList = () => {
  const { setIsLoading } = useContext(LoaderContext);

  const [bankList, setBankList] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [popupError, setPopupError] = useState(""); // Error for popup

  useEffect(() => {
    getBankList();
  }, []);

  const getBankList = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getBankList();
      if (!data.success) throw data.message;
      setBankList(data.data?.banks);
    } catch (error) {
      console.log(error);
      setBankList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Getting confirmation before deleting bank
  const handleOpenConfirmModal = (id, event) => {
    event.stopPropagation();
    setPopupError("");
    setSelectedBank(id);
    setShow(true);
  };

  // For Deleting bank after confirmation
  const handleDeleteBank = async () => {
    const id = selectedBank;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteBank({ id });
      if (!data.success) throw data.message;
      setSelectedBank("");
      await getBankList();
      toast.success(data.message);
      setShow(false);
    } catch (error) {
      setPopupError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getCapitalized = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Edit bank handler
  // const handleEditBank = async (bank) => {
  //   await dispatch(setEditBank(bank));
  //   navigate("/wallet/bank-list/edit-bank");
  // };

  const handleDefaultBank = async (radioe, bankId) => {
    const checked = radioe.currentTarget.checked;
    if (!checked) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.bankMarkAsDefault({ bank_id: bankId });
      if (!data.success) throw data.message;
      await getBankList();
      toast.success(data.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListItemClick = (e, bankId, idx) => {
    e.preventDefault();

    const element = document.getElementById(`bnk_acc_${bankId}_${idx}`);

    if(!element) {
      console.error(`Element with ID bnk_acc_${bankId}_${idx} not found.`);
      return;
    }

    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
      element.click();
    }
  };

  return (
    <div className="">
      <div className="title-content-wrap send-pay-title-sec title-common-sec">
        <h3>My Bank Accounts</h3>
        <p>Primary Bank Accounts</p>
      </div>
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            <li className="db-view-bank-div-main db-view-bank-common-div db-view-bank-heading">
              <div className="bank-logo-name-wrap">Bank Name</div>
              <div className="bank-account-type-wrap">Primary Account</div>
              <div className="bank-account-num-wrap">Account Number</div>
              {/* <div className="bank-account-routing-num">Swift Code</div> */}
              <div className="bank-account-type-wrap-1">Account Type</div>
              <div className="bank-del-wrap"> </div>
              <div className="bank-del-wrap"> </div>
            </li>
            {bankList && bankList.length > 0 ? (
              bankList?.map((elm, i) => (
                <li
                  key={"list" + elm?.bank_number}
                  className="db-view-bank-div-main db-view-bank-common-div"
                  onClick={(e) => handleListItemClick(e, elm.id, i)}
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
                  <div className="bank-account-type-wrap">
                    <input
                      type="radio"
                      id={`bnk_acc_${elm.id}_${i}`}
                      name="bank-account-primary"
                      checked={elm.mark_as_default === 1 ? true : false}
                      onChange={(e) => handleDefaultBank(e, elm.id)}
                    />
                    <label htmlFor={`bnk_acc_${elm.id}_${i}`}>
                      Primary Account
                    </label>
                  </div>
                  <div className="bank-account-num-wrap">
                    <span>{elm?.bank_number}</span>
                  </div>
                  {/* <div className=" bank-account-routing-num">
                    <span>{elm?.swift_code}</span>
                  </div> */}
                  <div className="bank-account-type-wrap-1">
                    {getCapitalized(elm?.account_type) + " Account"}
                  </div>
                  {/* <div className="bank-bal-wrap">Balance : <span>0</span></div> */}
                  {/* <button
                    type="button"
                    className="bank-del-wrap border-0"
                    onClick={() => handleEditBank(elm)}
                  >
                    <IconEdit style={{ stroke: "#9b9b9b" }} />
                  </button> */}
                  <div
                    className="bank-del-wrap"
                    onClick={(e) => handleOpenConfirmModal(elm.id, e)}
                  >
                    <IconCross style={{ stroke: "#9B9B9B" }} />
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center">Bank account not found</p>
            )}
          </ul>
        </div>
      </div>
      <div className="view_bank_listing_bottom-wrap">
        <Link to="/wallet/link-bank">+ Add Bank Account</Link>
      </div>
      <ModalConfirmation
        heading={"Delete bank account"}
        subHeading={"All your data will be permanently deleted."}
        error={popupError}
        show={show}
        setShow={setShow}
        handleCallback={handleDeleteBank}
      />
    </div>
  );
};

export default BankList;
