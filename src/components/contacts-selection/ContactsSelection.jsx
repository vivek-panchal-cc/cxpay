import React from "react";
import SwipeContactList from "components/lists/SwipeContactList";
import Input from "components/ui/Input";
import { IconCross, IconSearch } from "styles/svgs";

const ContactsSelection = (props) => {
  const { className, children } = props;
  return <div className={`send-inner-sec ${className}`}>{children}</div>;
};

ContactsSelection.Header = (props) => {
  const {
    className,
    heading,
    subHeading,
    searchValue,
    handleSearch,
    clearSearch,
  } = props;
  return (
    <div className={`send-top-sec ${className}`}>
      <div className="title-content-wrap">
        <h3>{heading}</h3>
        <p>{subHeading}</p>
      </div>
      <div className="send-top-right-sec">
        <div className="main-search-wrap">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-field search-field">
              <div
                className="clearsearchbox"
                style={{ opacity: searchValue ? 1 : 0 }}
                onClick={clearSearch}
              >
                <IconCross />
              </div>
              <Input
                type="search"
                className="form-control js-searchBox-input"
                name="search_field"
                placeholder="Search..."
                value={searchValue}
                onChange={handleSearch}
              />
              <div className="search-btn">
                <IconSearch style={{ stroke: "#0081c5" }} />
              </div>
            </div>
          </form>
        </div>
        {props.children}
      </div>
    </div>
  );
};

ContactsSelection.Body = (props) => {
  const {
    isLoading,
    className,
    classNameContainer,
    contacts,
    selectedContacts,
    fullWidth,
    emptyListMsg,
    handleReachEnd,
    handleSelectedItems,
    ListItemComponent = () => <>Item</>,
    ListItemComponentProps = {},
    ListItemComponentAlias = {},
  } = props;

  return (
    <>
      {(contacts && contacts.length > 0) || isLoading ? (
        <SwipeContactList
          isLoading={isLoading}
          list={contacts}
          selectedList={selectedContacts}
          className={className}
          containerClassName={classNameContainer}
          fullWidth={fullWidth}
          handleReachEnd={handleReachEnd}
          handleSelectedItems={handleSelectedItems}
          ListItemComponent={ListItemComponent}
          ListItemComponentProps={ListItemComponentProps}
          ListItemComponentAlias={ListItemComponentAlias}
        />
      ) : (
        <div className="loading">
          <p className="loading-data">{emptyListMsg}</p>
        </div>
      )}
    </>
  );
};

ContactsSelection.Footer = (props) => {
  const { className } = props;
  return (
    <div className={`login-btn ${className}`}>
      <div className="setting-btn-link send-btn-wrap pay-btn-wrap pt-3">
        {props.children}
      </div>
    </div>
  );
};

export default ContactsSelection;
