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

  return `${day}/${month}/${year} | ${hours}:${minutes} ${period}`;
}

export {
  getChargedAmount,
  addObjToFormData,
  timeStampToTimeString,
  dateFormattor,
  formatDate,
  formatDateToDesiredFormat,
};
