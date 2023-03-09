import ModalConfirmation from "components/modals/ModalConfirmation";
import { THEME_COLORS } from "constants/all";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IconBank, IconCross } from "styles/svgs";

const BankList = () => {
  const { setIsLoading } = useContext(LoaderContext);

  const [bankList, setBankList] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

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
      console.log("error: ", error);
      setBankList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirmModal = (id) => {
    setSelectedBank(id);
    setShow(true);
  };

  const handleDeleteBank = async () => {
    setIsLoading(true);
    const id = selectedBank;
    try {
      const { data } = await apiRequest.deleteBank({ id });
      if (!data.success) throw data.message;
      toast.success(data.message);
      setSelectedBank("");
      setShow(false);
      getBankList();
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getCapitalized = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="">
      <div className="db-view-bank-main db-view-card-main">
        <div className="db-view-bank-wrapper db-view-card-wrapper">
          <ul className="db-view-bank-listing">
            {bankList && bankList.length > 0 ? (
              bankList?.map((elm, i) => (
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
              ))
            ) : (
              <p>Bank Account Not Found</p>
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
        show={show}
        setShow={setShow}
        handleCallback={handleDeleteBank}
      />
    </div>
  );
};

export default BankList;
