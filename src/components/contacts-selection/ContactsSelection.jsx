import React from "react";
import SwipeContactList from "components/lists/SwipeContactList";
import Input from "components/ui/Input";
import { IconSearch } from "styles/svgs";

const ContactsSelection = (props) => {
  const { className, children } = props;
  return <div className={`send-inner-sec ${className}`}>{children}</div>;
};

ContactsSelection.Header = (props) => {
  const { className, heading, subHeading, handleSearch } = props;
  return (
    <div className={`send-top-sec ${className}`}>
      <div className="title-content-wrap">
        <h3>{heading}</h3>
        <p>{subHeading}</p>
      </div>
      <form>
        <div className="form-field search-field">
          <Input
            type="search"
            className="form-control js-searchBox-input"
            name="search_field"
            placeholder="Search..."
            onChange={handleSearch}
          />
          <div className="search-btn">
            <IconSearch />
          </div>
        </div>
      </form>
      {props.children}
    </div>
  );
};

ContactsSelection.Body = (props) => {
  const {
    className,
    classNameContainer,
    contacts,
    fullWidth,
    isMultiSelect,
    emptyListMsg,
    handleReachEnd,
    handleSelectedItems,
    ListItemComponent = () => <>Item</>,
    ListItemComponentProps = {},
    ListItemComponentAlias = {},
  } = props;

  return (
    <>
      {contacts && contacts.length > 0 ? (
        <SwipeContactList
          list={contacts}
          className={className}
          containerClassName={classNameContainer}
          fullWidth={fullWidth}
          isMultiSelect={isMultiSelect}
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
