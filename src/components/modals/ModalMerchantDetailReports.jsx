import React, { useEffect, useRef } from "react";
import styles from "./modal.module.scss";
import { getInitials, getRandomColorClass } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import { formatDateToDesiredFormat } from "helpers/commonHelpers";
import { IconCloseModal } from "styles/svgs";

const ModalMerchantDetailReports = (props) => {
  const tableTr = {
    display: "flex",
    flexDirection: "column",
    marginBottom: "25px",
  };
  const { className, classNameChild, id, show, setShow, details } = props;

  const {
    sname,
    ref_id,
    amount,
    profile_image,
    created_at,
    fees,
    mobile_number,
    merchant_fees_capacity,
  } = details || {};

  const modalRef = useRef(null);

  useEffect(() => {
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        if (setShow) setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow]);

  if (!show) return;
  return (
    <div className={`modal fade show ${styles.modal}`} id={id}>
      <div ref={modalRef} className={classNameChild}>
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "700px" }}
        >
          <div className="modal-content">
            <div className="modal-body">
              {/* <IconCloseModal
                style={{
                  position: "absolute",
                  top: "40px",
                  right: "40px",
                  cursor: "pointer",
                }}
                onClick={() => setShow(false)}
              />{" "} */}
              <>
                <div className="rcr-innner-wrap rcr-innner-wrap-1 pb-0 d-flex flex-wrap w-100 align-items-center">
                  <div className="rcrc-img-wrap rcr-img-wrap d-flex align-items-center">
                    <span bg-color="#000" className="user-thumb-name">
                      {profile_image ? (
                        <img src={profile_image} className="blue-bg" alt="" />
                      ) : (
                        <div
                          className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                            sname
                          )}`}
                        >
                          {getInitials(sname)}
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="rcr-info-main p-0">
                    <div className="rcr-info-1 d-flex flex-wrap">
                      <div className="rcr-card-data p-0">
                        <h2>{sname}</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rcr-divider-wrap"></div>
                <div className="rcr-innner-wrap rcr-innner-wrap-2 d-flex w-100">
                  <div className="w-100 rcr-transition-info merchant-reports rcr-transition-info-1 first-rec-detail">
                    <table>
                      <tbody>
                        <tr style={tableTr}>
                          <td className="pb-3">Reference ID</td>
                          <td>{ref_id}</td>
                        </tr>
                        <tr style={tableTr}>
                          <td className="pb-3">Received Amount</td>
                          <td>
                            <WrapAmount value={amount} />
                          </td>
                        </tr>
                        <tr style={tableTr}>
                          <td className="pb-3">Transaction Wise Cap Amount</td>
                          <td>
                            <WrapAmount value={merchant_fees_capacity} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="ms-4 w-100 rcr-transition-info rcr-transition-info-2">
                    <table>
                      <tbody>
                        <tr style={tableTr}>
                          <td className="pb-3">Mobile Number</td>
                          <td>{`+${mobile_number}`}</td>
                        </tr>

                        <tr style={tableTr}>
                          <td className="pb-3">Fees</td>
                          <td>
                            <WrapAmount value={fees} />
                          </td>
                        </tr>

                        <tr style={tableTr}>
                          <td className="pb-3">Transaction Date</td>
                          <td>{formatDateToDesiredFormat(created_at)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMerchantDetailReports;
