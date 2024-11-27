import React, { useState } from "react";
import Input from "components/ui/Input";
import Pagination from "components/pagination/Pagination";
import { IconCross, IconSearch } from "styles/svgs";
import LoaderMerchant from "loaders/LoaderMerchant";
import InputSelectSearch from "components/ui/InputSelectSearch";
import useMerchants from "hooks/useMerchants";
import useCountriesCities from "hooks/useCountriesCities";
import useBusinessCategories from "hooks/useBusinessCategories";
import MerchantsItem from "components/items/MerchantsItem";
import { useSelector } from "react-redux";
import Modal from "components/modals/Modal";
import MerchantQRPopup from "components/popups/MerchantQRPopup";

const Merchants = () => {
  const [countryList, cityList] = useCountriesCities();
  const [userData, setUserData] = useState({});
  const [showQR, setShowQR] = useState(false);
  const [categories] = useBusinessCategories();
  const { country: userCountry } = useSelector(
    (state) => state.userProfile.profile
  );

  // Contacts and it's pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [
    isLoadingMerchants,
    paginationMerchants,
    merchants,
    setMerchants,
    reloadMerchants,
  ] = useMerchants({
    page: currentPage,
    search: search,
    country: country || userCountry,
    category: category,
  });

  const handleSearchContact = (elm) => {
    setCurrentPage(1);
    setSearch(elm.target.value);
  };

  const handleCountry = (elm) => {
    setCurrentPage(1);
    setCountry(elm.target.value);
  };

  const handleCategory = (elm) => {
    setCurrentPage(1);
    setCategory(elm.target.value);
  };

  const handleQRShow = (data) => {
    setUserData(data);
    setShowQR(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="merchant-sec">
            <div className="merchant-top-sec">
              <div className="title-content-wrap">
                <h3>Merchants</h3>
              </div>
            </div>
            <div className="merchant-top-search-sec d-flex align-items-center">
              <div className="merchant-serch-main">
                <div className="form-field search-field">
                  <div
                    className="clearsearchbox"
                    style={{ opacity: search ? 1 : 0 }}
                    onClick={() => setSearch("")}
                  >
                    <IconCross />
                  </div>
                  <Input
                    type="search"
                    className="form-control js-searchBox-input"
                    name="search-field"
                    value={search}
                    onChange={handleSearchContact}
                    placeholder="Search..."
                  />
                  <div className="search-btn">
                    <IconSearch />
                  </div>
                </div>
              </div>
              <div className="merchant-top-btn-nav">
                <div className="merchant-customer-type merchant-first-child">
                  <div
                    className="clearsearchbox"
                    style={{ opacity: category ? 1 : 0 }}
                    onClick={() => {
                      setCategory("");
                      setCurrentPage(1);
                    }}
                  >
                    <IconCross />
                  </div>
                  <InputSelectSearch
                    className="anchor"
                    name="category"
                    value={category}
                    onChange={handleCategory}
                  >
                    <option value={""}>Category</option>
                    <option value={"all"}>All</option>
                    {categories?.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.name}
                      </option>
                    ))}
                  </InputSelectSearch>
                </div>
                <div className="merchant-customer-type merchant-last-child">
                  <div
                    className="clearsearchbox"
                    style={{ opacity: country ? 1 : 0 }}
                    onClick={() => {
                      setCountry("");
                      setCurrentPage(1);
                    }}
                  >
                    <IconCross />
                  </div>
                  <InputSelectSearch
                    className="anchor"
                    name="country"
                    value={country || userCountry}
                    onChange={handleCountry}
                  >
                    <option value={"all"}>All</option>
                    {countryList?.map((ct) => (
                      <option key={ct.iso} value={ct.iso}>
                        {ct.country_name}
                      </option>
                    ))}
                  </InputSelectSearch>
                </div>
              </div>
            </div>
            <div className="merchant-listing-container">
              <ul className="merchant-listing-wrap">
                {isLoadingMerchants ? (
                  <div className="d-flex flex-column gap-3 mt-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                      <LoaderMerchant
                        key={item}
                        style={{
                          background:
                            item % 2 === 0 ? "#f6f6f670" : "#fafafa70",
                          fill: "#000000",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  merchants?.map((merchant, index) => (
                    <MerchantsItem
                      key={merchant?.account_number || index}
                      merchant={merchant}
                      handleCallback={handleQRShow}
                      // selectedMerchants={selectedContacts}
                    />
                  ))
                )}
                {merchants.length <= 0 ? (
                  <p className="text-center">Merchants not found.</p>
                ) : null}
              </ul>
            </div>
            {!isLoadingMerchants &&
            paginationMerchants &&
            paginationMerchants.total > 10 ? (
              <Pagination
                siblingCount={1}
                active={paginationMerchants?.current_page}
                size={paginationMerchants?.last_page}
                onClickHandler={setCurrentPage}
              ></Pagination>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        id="merchant_qr_modal"
        show={showQR}
        className=""
        // classNameChild="modal-dialog w-100"
      >
        <MerchantQRPopup setShow={setShowQR} details={userData} />
      </Modal>
    </>
  );
};

export default Merchants;
