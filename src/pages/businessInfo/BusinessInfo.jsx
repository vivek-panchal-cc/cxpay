import { apiRequest } from "helpers/apiRequests";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BusinessForm from "./components/BusinessForm";
import "./businessInfo.css";
import QrCode from "./components/QrCode";

const BusinessInfo = () => {
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "personal" } = profile || {};
  const [countryList, setCountryList] = useState([]);

  const getCountries = async () => {
    try {
      const { data } = await apiRequest.getCountry();
      if (!data.success || data.data === null) throw data.message;
      setCountryList(data?.data?.country_list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);
  return (
    <div className="profile-right-sec business-info-right-sec">
      <div className="profile-inner-sec">
        <div className="business-info-left-content col-lg-7 col-12">
          <div className="business-info-sec">
            <div className="profile-info">
              <h3>Business Info</h3>
              <ul className="breadcrumb">
                <li>
                  <Link to="/setting">Settings</Link>
                </li>
                <li>Business Info</li>
              </ul>
            </div>
          </div>
          <div className="settings-profile-bottom-info-sec business-info-bottom-sec">
            <BusinessForm countryList={countryList} profile={profile} />
          </div>
        </div>
        <div className="profile-right-content col-lg-5 col-12">
          <QrCode qrCodeImg={profile?.qr_code_image} />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
