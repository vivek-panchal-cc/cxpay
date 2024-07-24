import React from "react";
import { CURRENCY_SYMBOL } from "constants/all";
import { NumericFormat } from "react-number-format";

const WrapAmount = ({ value, toFixed = 2, affix = "prefix", ...props }) => {
  return (
    <NumericFormat
      value={value}
      thousandsGroupStyle="lakh"
      displayType="text"
      decimalScale={toFixed}
      fixedDecimalScale
      thousandSeparator
      allowNegative
      {...(affix === "prefix" ? { prefix: `${CURRENCY_SYMBOL} ` } : {})}
      {...(affix === "suffix" ? { suffix: ` ${CURRENCY_SYMBOL}` } : {})}
      {...props}
    />
  );
};

export default WrapAmount;
