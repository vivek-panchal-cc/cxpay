import React from "react";
import ContentLoader from "react-content-loader";
import Select from "react-select";

const SingleValue = ({ data }) => (
  <div className="d-flex align-items-center">
    <img
      src={data.url}
      alt="Selected Icon"
      width="24"
      height="24"
      className="me-2"
    />
  </div>
);

const SkeletonOption = () => (
  <div className="d-flex flex-column align-items-center justify-content-center m-2">
    <ContentLoader
      speed={2}
      width={50}
      height={50}
      viewBox="0 0 50 50"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <circle cx="25" cy="25" r="24" />
    </ContentLoader>
  </div>
);

function InputIconSelect({
  labelname,
  error,
  disabled,
  options = [],
  useReactSelect,
  className,
  customStyles,
  placeholder,
  isLoading = false,
  ...props
}) {
  const skeletonOptions = Array.from({ length: 27 }).map((_, index) => ({
    label: <SkeletonOption />,
    value: `skeleton-${index}`,
    isDisabled: true,
  }));

  // Default custom styles for react-select
  const customDropdownStyles = {
    control: (base, state) => ({
      ...base,
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right .75rem center",
      backgroundSize: "16px 12px",
      minHeight: "45px",
      borderRadius: "18px",
      border: "1px solid #0081c5",
      boxShadow: "none",
      borderRadius: state.menuIsOpen ? "18px 18px 0 0" : "18px",
      borderBottom: state.menuIsOpen
        ? "1px solid #e4e3e5"
        : "1px solid #0081c5",
      "&:hover": {
        border: "1px solid #0081c5",
        borderBottom: state.menuIsOpen
          ? "1px solid #e4e3e5"
          : "1px solid #0081c5",
      },
      filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))",
      backgroundColor: "#fff",
      fontSize: "14px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: "5px", // Pushes the content to the start
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
    }),
    option: (base, { isSelected }) => ({
      ...base,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "50px", // Set a fixed width for grid layout
      height: "50px",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: isSelected ? "transparent" : "#fff",
      border: isSelected ? "1px solid #0081c5" : "1px solid #fff",
      color: isSelected ? "#fff" : "#212529",
      ":hover": {
        backgroundColor: "transparent",
        border: "1px solid #0081c5",
      },
    }),
    menu: (base) => ({
      ...base,
      marginTop: "0",
      padding: "4px 20px",
      borderRadius: "0 0 18px 18px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      display: "flex",
      flexWrap: "wrap", // Allow multiple items in a row
      border: "1px solid #0081c5",
      borderTop: "none",
    }),
    menuList: (base) => ({
      ...base,
      display: "flex",
      flexWrap: "wrap", // Enables multi-row layout
      overflowY: "auto", // Enables scrolling
      scrollbarWidth: "none", // Firefox
      scrollbarColor: "#f0f0f0", // Scrollbar color for Firefox
    }),
    placeholder: (base) => ({
      ...base,
      // padding: "14px",
      fontSize: "16px",
      fontWeight: 500,
      fontFamily: `"Comfortaa", sans-serif`,
      color: "#363853",
    }),
  };

  return (
    <div className={`d-flex flex-column form-field`}>
      {labelname && <label className="mb-2">{labelname}</label>}

      {useReactSelect ? (
        <Select
          {...props}
          options={isLoading ? skeletonOptions : options}
          isDisabled={disabled}
          isSearchable={false}
          styles={customStyles || customDropdownStyles} // Use custom styles if provided
          classNamePrefix="jar-icon-input"
          placeholder={placeholder || "Select an option"}
          value={
            options.find((option) => option.value === props.value?.id) || null
          }
          // components={{ SingleValue }}
        />
      ) : (
        <select
          {...props}
          className={`${className} ${disabled ? "cursor-not-allowed" : ""}`}
          disabled={disabled || isLoading}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-danger ps-2">{error}</p>}
    </div>
  );
}

export default InputIconSelect;
