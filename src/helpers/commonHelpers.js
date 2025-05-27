const getChargedAmount = (charges = [], amounts = []) => {
  if (!charges || amounts.length <= 0)
    return { allCharges: [], grandTotal: 0, total: 0 };
  const total = amounts.reduce((prev, curr) => prev + curr, 0);
  let allCharges = [],
    totalCharges = 0,
    grandTotal = total;
  allCharges = charges?.map((item) => {
    const { type = "", amount = 0, text = "" } = item;
    const thisCharge = { desc: "", amount: 0 };
    switch (type) {
      case "fixed":
        thisCharge.amount = total <= 0 ? 0 : amount * amounts.length;
        thisCharge.desc = text;
        break;
      case "percentage":
        const deduct = total * (amount / 100);
        thisCharge.amount = deduct;
        thisCharge.desc = text;
        break;
      default:
        break;
    }
    grandTotal += thisCharge.amount;
    totalCharges += thisCharge.amount;
    return thisCharge;
  });
  return {
    allCharges,
    totalCharges,
    total,
    grandTotal,
  };
};

const getChargedCommissionAmount = (
  charges = [],
  amounts = [],
  values = []
) => {
  if (!charges || amounts.length <= 0)
    return { allCharges: [], grandTotal: 0, total: 0 };

  let chargeMap = new Map(); // Store merged charges
  let grandTotal = 0;
  let totalCharges = 0;
  let total = amounts.reduce((prev, curr) => prev + curr, 0); // Compute total upfront
  let individualTotals = [];

  values.forEach((item, index) => {
    const { user_type, merchant_fees = {} } = item;
    let chargeAmount = 0;
    let individualTotal = amounts[index] || 0; // Use individual amount per account
    let chargeDesc = merchant_fees.merchant_fees_title || "Merchant Fees";

    switch (user_type) {
      case "business":
        if (merchant_fees.merchant_fees) {
          const {
            merchant_fees_type,
            fees_deduct_account,
            merchant_fees: feeAmount,
            merchant_fees_capacity,
          } = merchant_fees;
          const numericFeeAmount = parseFloat(feeAmount) || 0;
          const numericMerchantFeesCapacity =
            parseFloat(merchant_fees_capacity) ||
            individualTotal * (numericFeeAmount / 100);

          if (fees_deduct_account === "sender") {
            switch (merchant_fees_type) {
              case "fixed":
                chargeAmount = individualTotal > 0 ? numericFeeAmount : 0;
                break;
              case "percentage":
                chargeAmount =
                  individualTotal > 0
                    ? Math.min(
                        individualTotal * (numericFeeAmount / 100),
                        numericMerchantFeesCapacity
                      )
                    : 0;
                break;
            }
            individualTotal += chargeAmount; // Apply charge per account
            totalCharges += chargeAmount;

            // Merge charges in the map
            if (chargeMap.has(chargeDesc)) {
              chargeMap.set(
                chargeDesc,
                chargeMap.get(chargeDesc) + chargeAmount
              );
            } else {
              chargeMap.set(chargeDesc, chargeAmount);
            }
          } else if (fees_deduct_account === "receiver") {
            // Charge applies but should not be displayed
            totalCharges += chargeAmount;
            individualTotal += chargeAmount;
          }
        }
        break;

      case "personal":
        charges.forEach(({ type, amount, text }) => {
          let thisChargeAmount = 0;

          switch (type) {
            case "fixed":
              thisChargeAmount = individualTotal > 0 ? amount : 0;
              break;
            case "percentage":
              thisChargeAmount =
                individualTotal > 0 ? individualTotal * (amount / 100) : 0;
              break;
          }

          totalCharges += thisChargeAmount;
          individualTotal += thisChargeAmount;

          // Merge charges in the map
          if (chargeMap.has(text)) {
            chargeMap.set(text, chargeMap.get(text) + thisChargeAmount);
          } else {
            chargeMap.set(text, thisChargeAmount);
          }
        });
        break;

      default:
        break;
    }

    individualTotals.push(individualTotal); // Store total per account
    grandTotal += individualTotal; // Sum up all individual totals
  });

  // Convert chargeMap to an array for final result
  let allCharges = Array.from(chargeMap, ([desc, amount]) => ({
    desc,
    amount,
  }));

  return {
    allCharges,
    totalCharges,
    total, // Returning total like in old code
    grandTotal,
  };
};

function addObjToFormData(obj, pkey, formData) {
  switch (Object.prototype.toString.call(obj)) {
    case "[object Array]":
      for (let i = 0; i < obj.length; i++) {
        const nKey = `${pkey}[${i}]`;
        addObjToFormData(obj[i], nKey, formData);
      }
      return;
    case "[object Object]":
      for (const key in obj) {
        const nKey = `${pkey}[${key}]`;
        addObjToFormData(obj[key], nKey, formData);
      }
      return;
    case "[object String]":
      formData.append(`${pkey}`, obj);
      return;
    case "[object Number]":
      formData.append(`${pkey}`, obj);
      return "obj";
    default:
      return;
  }
}

const timeStampToTimeString = (tstamp) => {
  const stampDate = new Date(tstamp * 1000);
  const now = new Date();
  const diff = now - stampDate;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const hour = Math.floor(diff / 1000 / 60 / 60);
  const min = Math.floor(diff / 1000 / 60);
  if (days > 0)
    return `${stampDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} at ${stampDate.toLocaleTimeString("en-GB", { timeStyle: "short" })}`;
  else if (hour < 24 && hour > 0) return `${hour} hour ago`;
  else if (min < 60 && min > 0) return `${min} min ago`;
  return `Just now`;
};

const dateFormattor = (date) => {
  if (!date) return;
  const dts = date.toLocaleDateString("en-CA");
  const tms = date.toLocaleTimeString(undefined, { hourCycle: "h24" });
  return `${dts} ${tms}`;
};

const formatDate = (dateStr) => {
  // Convert to ISO string format
  const isoDateStr = dateStr.replace(" ", "T");

  const dateObj = new Date(isoDateStr);
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const dd = String(dateObj.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[dateObj.getMonth()];
  const yyyy = dateObj.getFullYear();

  let hh = dateObj.getHours();
  let period = "AM";
  if (hh >= 12) {
    if (hh > 12) hh -= 12; // Convert to 12-hour format
    period = "PM";
  }
  hh = String(hh).padStart(2, "0");
  const min = String(dateObj.getMinutes()).padStart(2, "0");

  return `${dd} ${month} ${yyyy}, at ${hh}:${min} ${period}`;
};

function formatDateToDesiredFormat(dateString) {
  // Convert "YYYY-MM-DD HH:MM:SS" to "YYYY/MM/DDTHH:MM:SS" format
  const reformattedDate = dateString.replace(" ", "T");

  const dateObj = new Date(reformattedDate);

  // Extract the day, month, and year
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Add 1 to get the month number and pad to 2 digits
  const year = dateObj.getFullYear();

  // Extract the hours and minutes
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) hours -= 12; // Convert 24-hour format to 12-hour format
  if (hours === 0) hours = 12; // If it's 00 hours, change to 12 (for 12 AM)

  // Add leading zero if necessary
  hours = String(hours).padStart(2, "0");

  return `${day}/${month}/${year} | ${hours}:${minutes} ${period}`;
}

export {
  getChargedAmount,
  getChargedCommissionAmount,
  addObjToFormData,
  timeStampToTimeString,
  dateFormattor,
  formatDate,
  formatDateToDesiredFormat,
};
