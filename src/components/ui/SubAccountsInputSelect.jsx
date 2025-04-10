import React, { useState, useEffect, useRef } from "react";
import { IconCheckMark, IconDownArrow } from "styles/svgs";

function SubAccountsInputSelect({
  labelname,
  className,
  error,
  disabled,
  options,
  onChange,
  value,
}) {
  const [expandedParent, setExpandedParent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!disabled) setIsDropdownOpen((prev) => !prev);
  };

  const toggleExpand = (parentId) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="d-flex flex-column form-field position-relative"
      ref={dropdownRef}
    >
      {labelname && <label className="mb-2">{labelname}</label>}

      <div className="jar-custom-dropdown">
        <button
          type="button"
          className={`jar-dropdown-toggle ${className} ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          onClick={toggleDropdown}
        >
          {value
            ? findSelectedLabel(value, options)
            : "Select Sub-account Category"}
        </button>

        {isDropdownOpen && (
          <div className="jar-dropdown-menu show">
            <ul className="main-ul">
              {options?.map((parent) => (
                <li key={parent.id} className="parent-item">
                  <button
                    type="button"
                    className={`jar-dropdown-item parent-option ${
                      expandedParent === parent.id ? "selected" : ""
                    }`}
                    onClick={() => toggleExpand(parent.id)}
                  >
                    <span className="toggle-icon">
                      <IconDownArrow
                        style={{
                          width: "8px",
                          height: "10px",
                          transition: "transform 0.3s ease-in-out",
                          transform:
                            expandedParent === parent.id
                              ? "rotate(180deg)"
                              : "rotate(90deg)",
                        }}
                      />
                    </span>
                    {capitalizeWordByWord(parent.jar_category_name)}
                  </button>

                  <ul
                    className={`child-options ${
                      expandedParent === parent.id ? "expanded" : ""
                    }`}
                  >
                    {parent.children?.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          className={`jar-dropdown-item child-option ${
                            value === child.id ? "selected" : ""
                          }`}
                          onClick={() => {
                            onChange(child.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="toggle-icon">
                            <IconCheckMark />
                          </span>
                          {capitalizeWordByWord(child.jar_category_name)}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        className={`jar-dropdown-item child-option ${
                          value === `other-${parent.id}` ? "selected" : ""
                        }`}
                        onClick={() => {
                          onChange(`other-${parent.id}`);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="toggle-icon">
                          <IconCheckMark />
                        </span>
                        Other
                      </button>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error ? <p className="text-danger ps-2">{error}</p> : null}
    </div>
  );
}

const findSelectedLabel = (value, options) => {
  for (let parent of options) {
    if (parent.id === value)
      return capitalizeWordByWord(parent.jar_category_name);
    if (parent.children) {
      for (let child of parent.children) {
        if (child.id === value)
          return capitalizeWordByWord(child.jar_category_name);
      }
    }
    if (`other-${parent.id}` === value)
      return `Other ${capitalizeWordByWord(parent.jar_category_name)}`;
  }
  return "Select Sub-account Category";
};

const capitalizeWordByWord = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default SubAccountsInputSelect;
