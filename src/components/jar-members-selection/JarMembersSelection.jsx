import React from "react";
import SwipeMembersList from "components/lists/SwipeMembersList";
import Input from "components/ui/Input";
import { IconCross, IconSearch } from "styles/svgs";

const JarMembersSelection = (props) => {
  const { className, children } = props;
  return <div className={`send-inner-sec ${className}`}>{children}</div>;
};

JarMembersSelection.Header = (props) => {
  const {
    className,
    heading,
    subHeading,
    searchValue,
    handleSearch,
    clearSearch,
    handleShowAll,
    members,
  } = props;
  return (
    <div className={`send-top-sec ${className}`}>
      <div className="title-content-wrap">
        <h3>{heading}</h3>
        <p>{subHeading}</p>
      </div>
      <div className="send-top-right-sec">
        {members?.length > 0 && (
          <a className="action-button" onClick={handleShowAll}>
            Show All
          </a>
        )}
        {/* <div className="main-search-wrap">
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
        </div> */}
        {props.children}
      </div>
    </div>
  );
};

JarMembersSelection.Body = (props) => {
  const {
    isLoading,
    className,
    classNameContainer,
    members,
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
      {(members && members.length > 0) || isLoading ? (
        <SwipeMembersList
          isLoading={isLoading}
          list={members}
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

JarMembersSelection.Footer = (props) => {
  const { className } = props;
  return (
    <div className={`login-btn ${className}`}>
      <div className="setting-btn-link send-btn-wrap pay-btn-wrap pt-3">
        {props.children}
      </div>
    </div>
  );
};

export default JarMembersSelection;
