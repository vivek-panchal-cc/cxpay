import React from "react";

const InputRadioType = (props) => {
  const {
    name = "",
    valueSelected = "",
    valueTypeOne = "",
    valueTypeTwo = "",
    idTypeOne = `in_type1${Math.round(Math.random() * 1000)}`,
    idTypeTwo = `in_type2${Math.round(Math.random() * 1000)}`,
    classNameTypeOne = "",
    classNameTypeTwo = "",
    handleChange = () => {},
    disabled = false,
  } = props;

  return (
    <div className="radio-wrap my-4 mw-100">
      <div className="col-6 form-check">
        <input
          className={`form-check-input ${
            disabled ? "cursor-not-allowed" : ""
          } ${classNameTypeOne}`}
          type="radio"
          id={idTypeOne}
          name={name}
          value={valueTypeOne}
          onChange={handleChange}
          checked={valueSelected === valueTypeOne ? true : false}
          disabled={disabled}
        />
        <label className="w-100 form-check-label" htmlFor={idTypeOne}>
          {valueTypeOne}
        </label>
      </div>
      <div className="col-6 form-check">
        <input
          className={`form-check-input ${
            disabled ? "cursor-not-allowed" : ""
          } ${classNameTypeTwo}`}
          type="radio"
          id={idTypeTwo}
          name={name}
          value={valueTypeTwo}
          onChange={handleChange}
          checked={valueSelected === valueTypeTwo ? true : false}
          disabled={disabled}
        />
        <label className="w-100 form-check-label" htmlFor={idTypeTwo}>
          {valueTypeTwo}
        </label>
      </div>
    </div>
  );
};

export default InputRadioType;
