import {
  IconActReqCancel,
  IconActReqDecline,
  IconActReqReceive,
  IconActReqSent,
  IconNotifyContactAccept,
  IconNotifyMoneyRecieved,
  IconNotifyMoneyRequest,
  IconNotifyMoneySent,
  IconNotifyMoneySentFailed,
} from "styles/svgs";

// Expressions
const exp0ContainWhitespace = /^\S*$/;
const exp0ContainWordPassword = /^((?!password).)*$/gim;
const expContainCapitalLetter = /^(?=.*[A-Z])/;
const expContainNumber = /^(?=.*\d)/;
const expContainSpecialChar = /^(?=.*[!@#$%^&*])/;
const validFileExtensions = {
  image: ["jpg", "png", "jpeg", "svg", "heif", "hevc"],
  receipt: ["jpg", "png", "jpeg", "heif", "hevc", "pdf", "tif", "tiff", "webp"],
  pdf: ["pdf"],
};

// Test Functions
const regexNotContainWhitespace = (testStr) =>
  new RegExp(exp0ContainWhitespace).test(testStr);

const regexNotContainWordPassword = (testStr) =>
  new RegExp(exp0ContainWordPassword).test(testStr);

const regexContainCapitalLetter = (testStr) =>
  new RegExp(expContainCapitalLetter).test(testStr);

const regexContainNumber = (testStr) =>
  new RegExp(expContainNumber).test(testStr);

const regexContainSpecialCharacter = (testStr) =>
  new RegExp(expContainSpecialChar).test(testStr);

// regex
const url_regex =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

// To check file type
const isValidFileType = (fileName, fileType) => {
  return (
    fileName &&
    validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
  );
};

// const otpCounterTime = 180;
const otpCounterTime = 60;
const FILE_SIZE = 5 * 1048576;

// theme colors
const THEME_COLORS = ["light_blue"];

// To check file size
// const validFileSize = "5MB";
// const fileUploadLimit = (file, fileSize) => {
//   return file && validFileSize[file].indexOf(file.split(".").pop()) > -1;
// };

// CXPAY LOGO
const CXPAY_LOGO = "/assets/images/cxpay_me_logo.png";
const CXPAY_SHADOW_LOGO = "/assets/images/cxpay_me_shadow_logo.png";

// Fund account flow constants
const FUND_CARD = "card";
const FUND_MANUAL = "manual-topup";
const FUND_BANK = "bank-transfer";
const MAX_PAYMENT_CONTACTS = 30;
const MAX_REQUEST_CONTACTS = 30;
const MAX_GROUP_MEMBERS = 30;

// Rename Keys with provided alias
const renameKeys = (keysMap, object) =>
  Object.keys(object).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: object[key] },
    }),
    {}
  );

// Notification types constants
const NOTIFY_REQUEST = "request";
const NOTIFY_RECEIVE = "receive";
const NOTIFY_PAY_FAIL = "payment_fail";
const NOTIFY_PAY_COMPLETE = "payment_completed";
const NOTIFY_CON_REGISTER = "contact_register";
const NOTIFY_MANUAL_TOPUP = "manual_top_up";

// Notifications Type Constants
const notificationType = {
  [NOTIFY_REQUEST]: {
    icon: IconNotifyMoneyRequest,
    redirect: "/activities",
  },
  [NOTIFY_RECEIVE]: {
    icon: IconNotifyMoneyRecieved,
    redirect: "/activities",
  },
  [NOTIFY_PAY_FAIL]: {
    icon: IconNotifyMoneySentFailed,
    redirect: "/activities",
  },
  [NOTIFY_PAY_COMPLETE]: {
    icon: IconNotifyMoneySent,
    redirect: "/activities",
  },
  [NOTIFY_CON_REGISTER]: {
    icon: IconNotifyContactAccept,
    redirect: "/contacts",
  },
  [NOTIFY_MANUAL_TOPUP]: {
    icon: IconNotifyMoneyRecieved,
    redirect: "/activities",
  },
  "": {
    icon: "",
    redirect: "/wallet",
  },
};

const ACT_TYPE_REQUEST = "request";
const ACT_TYPE_TRANSACTION = "transaction";
const ACT_REQUEST_SEND = "send";
const ACT_REQUEST_RECEIVE = "receive";
const ACT_TRANSACT_CREDIT = "credit";
const ACT_TRANSACT_DEBIT = "debit";
const ACT_STATUS_PENDING = "PENDING";
const ACT_STATUS_DECLINED = "DECLINED";
const ACT_STATUS_CANCELLED = "CANCELLED";
const ACT_STATUS_PAID = "PAID";
const ACT_STATUS_FAILED = "FAILED";
const ACT_STATUS_PROCESSING = "PROCESSING";
const ACT_STATUS_APPROVED = "APPROVED";
const ACT_STATUS_REJECTED = "REJECTED";
const ACT_STATUS_SUCCESS = "SUCCESS";
const TXN_TYPE_PL = "PL";
const TXN_TYPE_WW = "WW";
const TXN_TYPE_WD = "WD";
const TXN_TYPE_MF = "MF";
const TXN_TYPE_WITHDRAW = "withdraw";
const TXN_TYPE_AGENT = "AGENT TOPUP";

const activityConsts = {
  [ACT_TYPE_REQUEST]: {
    [ACT_REQUEST_SEND]: {
      [ACT_STATUS_PENDING]: {
        iconStatus: <IconActReqSent />,
        iconAmount: "",
        classStatus: "btn-blue",
        classBg: "cx-bg-blue",
        classText: "",
        textStatus: "Request Sent",
        desc: "Requesting money from YYYY",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Declined",
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Cancelled",
        desc: "Requested money from YYYY",
      },
      [ACT_STATUS_PAID]: {
        iconStatus: <IconActReqSent />,
        iconAmount: "+",
        classStatus: "btn-blue",
        classBg: "cx-bg-blue",
        classText: "cx-color-green",
        textStatus: "Request Sent",
        desc: "Requested money from YYYY",
      },
    },
    [ACT_REQUEST_RECEIVE]: {
      [ACT_STATUS_PENDING]: {
        iconStatus: <IconActReqReceive />,
        iconAmount: "",
        classStatus: "btn-green",
        classBg: "cx-bg-green",
        classText: "",
        textStatus: "Request received",
        desc: "YYYY requesting money from you",
      },
      [ACT_STATUS_DECLINED]: {
        iconStatus: <IconActReqDecline />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Declined",
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_CANCELLED]: {
        iconStatus: <IconActReqCancel />,
        iconAmount: "",
        classStatus: "btn-red",
        classBg: "cx-bg-red",
        classText: "cx-color-red",
        textStatus: "Request Cancelled",
        desc: "YYYY requested money from you",
      },
      [ACT_STATUS_PAID]: {
        iconStatus: <IconActReqReceive />,
        iconAmount: "-",
        classStatus: "btn-green",
        classBg: "cx-bg-green",
        classText: "",
        textStatus: "Request received",
        desc: "YYYY requested money from you",
      },
    },
  },
  [ACT_TYPE_TRANSACTION]: {
    [ACT_TRANSACT_CREDIT]: {
      [TXN_TYPE_PL]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Pending",
          textDetailStatus: "Amount Credit Pending",
          desc: "From YYYY",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Processing",
          textDetailStatus: "Amount Credit In Progress",
          desc: "From YYYY",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "cx-color-green",
          classDetailStatus: "cx-color-green",
          textStatus: "Receive",
          textDetailStatus: "Amount Credited",
          desc: "From YYYY",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Failed",
          textDetailStatus: "Amount Credit Failed",
          desc: "From YYYY",
        },
      },
      [TXN_TYPE_MF]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-blue",
          classBg: "cx-bg-blue",
          classText: "",
          classDetailStatus: "cx-color-blue",
          textStatus: "Topup Pending",
          textDetailStatus: "Topup Pending",
          desc: "From YYYY",
        },
        [ACT_STATUS_APPROVED]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "cx-color-green",
          classDetailStatus: "cx-color-green",
          textStatus: "Topup Approved",
          textDetailStatus: "Topup Approved",
          desc: "Topup request approved by admin",
        },
        [ACT_STATUS_REJECTED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Topup Rejected",
          textDetailStatus: "Topup Rejected",
          desc: "Topup request rejected by admin",
        },
      },
      [TXN_TYPE_WW]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Pending",
          textDetailStatus: "Amount Credit Pending",
          desc: "From YYYY",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Processing",
          textDetailStatus: "Amount Credit In Progress",
          desc: "From YYYY",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "cx-color-green",
          classDetailStatus: "cx-color-green",
          textStatus: "Receive",
          textDetailStatus: "Amount Credited",
          desc: "From YYYY",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Failed",
          textDetailStatus: "Amount Credit Failed",
          desc: "From YYYY",
        },
      },
      [TXN_TYPE_AGENT]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Pending",
          textDetailStatus: "Amount Credit Pending",
          desc: "From YYYY",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Processing",
          textDetailStatus: "Amount Credit In Progress",
          desc: "From YYYY",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "+",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "cx-color-green",
          classDetailStatus: "cx-color-green",
          textStatus: "Receive",
          textDetailStatus: "Amount Credited",
          desc: "From YYYY",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Failed",
          textDetailStatus: "Amount Credit Failed",
          desc: "From YYYY",
        },
      },
      [TXN_TYPE_WD]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-blue",
          classBg: "cx-bg-blue",
          classText: "",
          classDetailStatus: "cx-color-blue",
          textStatus: "Refund Initiated",
          textDetailStatus: "Refund Initiated",
          desc: "Refund request initiated",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-orange",
          classBg: "cx-bg-orange",
          classText: "",
          classDetailStatus: "cx-color-orange",
          textStatus: "Refund Inprogress",
          textDetailStatus: "Refund Inprogress",
          desc: "Refund request mark as inprocess by admin",
        },
        [ACT_STATUS_APPROVED]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refund Approved",
          textDetailStatus: "Refund Approved",
          desc: "Refund request approved by admin",
        },
        [ACT_STATUS_REJECTED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Rejected",
          textDetailStatus: "Refund Rejected",
          desc: "Refund request rejected by admin",
        },
        [ACT_STATUS_DECLINED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Declined",
          textDetailStatus: "Refund Declined",
          desc: "",
        },
        [ACT_STATUS_CANCELLED]: {
          iconStatus: <IconActReqCancel />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          textStatus: "Refund Cancelled",
          textDetailStatus: "Refund Cancelled",
          desc: "Refund request cancelled by you",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refunded",
          textDetailStatus: "Amount Debited",
          desc: "You refunded",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Failed",
          textDetailStatus: "Refund Failed",
          desc: "You refunded",
        },
      },
    },
    [ACT_TRANSACT_DEBIT]: {
      [TXN_TYPE_WW]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Pending",
          textDetailStatus: "Amount Debit Pending",
          desc: "To YYYY",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Sent",
          textDetailStatus: "Amount Debited",
          desc: "To YYYY",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Failed",
          textDetailStatus: "Amount Debit Failed",
          desc: "To YYYY",
        },
      },
      [TXN_TYPE_WD]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-blue",
          classBg: "cx-bg-blue",
          classText: "",
          classDetailStatus: "cx-color-blue",
          textStatus: "Refund Initiated",
          textDetailStatus: "Refund Initiated",
          desc: "Refund request initiated",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-orange",
          classBg: "cx-bg-orange",
          classText: "",
          classDetailStatus: "cx-color-orange",
          textStatus: "Refund Inprogress",
          textDetailStatus: "Refund Inprogress",
          desc: "Refund request mark as inprocess by admin",
        },
        [ACT_STATUS_APPROVED]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refund Approved",
          textDetailStatus: "Refund Approved",
          desc: "Refund request approved by admin",
        },
        [ACT_STATUS_REJECTED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Rejected",
          textDetailStatus: "Refund Rejected",
          desc: "Refund request rejected by admin",
        },
        [ACT_STATUS_DECLINED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Declined",
          textDetailStatus: "Refund Declined",
          desc: "",
        },
        [ACT_STATUS_CANCELLED]: {
          iconStatus: <IconActReqCancel />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          textStatus: "Refund Cancelled",
          textDetailStatus: "Refund Cancelled",
          desc: "Refund request cancelled by you",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refunded",
          textDetailStatus: "Amount Debited",
          desc: "You refunded",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Failed",
          textDetailStatus: "Refund Failed",
          desc: "You refunded",
        },
      },
      [TXN_TYPE_WITHDRAW]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-blue",
          classBg: "cx-bg-blue",
          classText: "",
          classDetailStatus: "cx-color-blue",
          textStatus: "Refund Initiated",
          textDetailStatus: "Refund Initiated",
          desc: "Refund request initiated",
        },
        [ACT_STATUS_PROCESSING]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-orange",
          classBg: "cx-bg-orange",
          classText: "",
          classDetailStatus: "cx-color-orange",
          textStatus: "Refund Inprogress",
          textDetailStatus: "Refund Inprogress",
          desc: "Refund request mark as inprocess by admin",
        },
        [ACT_STATUS_APPROVED]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refund Approved",
          textDetailStatus: "Refund Approved",
          desc: "Refund request approved by admin",
        },
        [ACT_STATUS_REJECTED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Rejected",
          textDetailStatus: "Refund Rejected",
          desc: "Refund request rejected by admin",
        },
        [ACT_STATUS_DECLINED]: {
          iconStatus: <IconActReqDecline />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Declined",
          textDetailStatus: "Refund Declined",
          desc: "",
        },
        [ACT_STATUS_CANCELLED]: {
          iconStatus: <IconActReqCancel />,
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          textStatus: "Refund Cancelled",
          textDetailStatus: "Refund Cancelled",
          desc: "Refund request cancelled by you",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-green",
          classBg: "cx-bg-green",
          classText: "",
          classDetailStatus: "cx-color-green",
          textStatus: "Refunded",
          textDetailStatus: "Amount Debited",
          desc: "You refunded",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Refund Failed",
          textDetailStatus: "Refund Failed",
          desc: "You refunded",
        },
      },
      [TXN_TYPE_AGENT]: {
        [ACT_STATUS_PENDING]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Pending",
          textDetailStatus: "Amount Debit Pending",
          desc: "To YYYY",
        },
        [ACT_STATUS_PAID]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "",
          classDetailStatus: "cx-color-red",
          textStatus: "Sent",
          textDetailStatus: "Amount Debited",
          desc: "To YYYY",
        },
        [ACT_STATUS_FAILED]: {
          iconStatus: "",
          iconAmount: "-",
          classStatus: "btn-red",
          classBg: "cx-bg-red",
          classText: "cx-color-red",
          classDetailStatus: "cx-color-red",
          textStatus: "Failed",
          textDetailStatus: "Amount Debit Failed",
          desc: "To YYYY",
        },
      }
    },
  },
};

const withdrawConsts = {
  [ACT_STATUS_PENDING]: {
    iconAmount: "",
    classStatus: "btn-blue",
    classText: "cx-color-blue",
  },
  [ACT_STATUS_PROCESSING]: {
    iconAmount: "",
    classStatus: "btn-blue",
    classText: "cx-color-blue",
  },
  [ACT_STATUS_APPROVED]: {
    iconAmount: "-",
    classStatus: "btn-green",
    classText: "cx-color-green",
  },
  [ACT_STATUS_REJECTED]: {
    iconAmount: "",
    classStatus: "btn-red",
    classText: "cx-color-red",
  },
  [ACT_STATUS_CANCELLED]: {
    iconAmount: "",
    classStatus: "btn-red",
    classText: "cx-color-red",
  },
  [ACT_STATUS_PAID]: {
    iconAmount: "",
    classStatus: "btn-green",
    classText: "cx-color-green",
  },
  [ACT_STATUS_SUCCESS]: {
    iconAmount: "",
    classStatus: "btn-green",
    classText: "cx-color-green",
  },
  [ACT_STATUS_FAILED]: {
    iconAmount: "",
    classStatus: "btn-red",
    classText: "cx-color-red",
  },
};

// Currency Symbol
const CURRENCY_SYMBOL = "ANG";

// Buffer Time for schedule
const SCHEDULE_BUFFER = 5;

// Charges Types
const CHARGES_TYPE_WW = "pay_type=WW";
const CHARGES_TYPE_PL = "pay_type=PL";
const CHARGES_TYPE_WD = "pay_type=WD";
const CHARGES_TYPE_MF = "pay_type=MF";

// Withdraw options tabs list
const WITHDRAW_OPTIONS_TABS_LIST = [
  { title: "Card", url: "/wallet/withdrawals-card" },
  { title: "Bank", url: "/wallet/withdrawals-bank" },
];

// Payment options tabs list
const PAYMENT_OPTIONS_TABS_LIST = [
  { title: "Schedule Payments", url: "/view-schedule-payment" },
  { title: "Recurring Payments", url: "/view-recurring-payment" },
];

// Withdraw status filters list for card transactions
const WITHDRAW_STATUS_FILTER_CARD = [
  { title: "Refundable", status: "ENABLE" },
  { title: "Non Refundable", status: "DISABLE" },
];

// Withdraw status filters list for bank transactions
const WITHDRAW_STATUS_FILTER_BANK = [
  { title: "PENDING", status: "PENDING" },
  { title: "PROCESSING", status: "PROCESSING" },
  { title: "APPROVED", status: "APPROVED" },
  { title: "CANCELLED", status: "CANCELLED" },
  { title: "REJECTED", status: "REJECTED" },
];

export {
  exp0ContainWhitespace,
  exp0ContainWordPassword,
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  validFileExtensions,
  otpCounterTime,
  url_regex,
  notificationType,
  activityConsts,
  withdrawConsts,
  THEME_COLORS,
  CURRENCY_SYMBOL,
  SCHEDULE_BUFFER,
  FUND_CARD,
  FUND_MANUAL,
  FUND_BANK,
  MAX_GROUP_MEMBERS,
  MAX_PAYMENT_CONTACTS,
  MAX_REQUEST_CONTACTS,
  CXPAY_LOGO,
  CXPAY_SHADOW_LOGO,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
  ACT_REQUEST_SEND,
  ACT_REQUEST_RECEIVE,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_STATUS_PENDING,
  ACT_STATUS_DECLINED,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_PAID,
  ACT_STATUS_FAILED,
  ACT_STATUS_PROCESSING,
  ACT_STATUS_APPROVED,
  ACT_STATUS_REJECTED,
  ACT_STATUS_SUCCESS,
  NOTIFY_REQUEST,
  NOTIFY_RECEIVE,
  NOTIFY_PAY_FAIL,
  NOTIFY_PAY_COMPLETE,
  NOTIFY_CON_REGISTER,
  CHARGES_TYPE_WW,
  CHARGES_TYPE_PL,
  CHARGES_TYPE_WD,
  CHARGES_TYPE_MF,
  WITHDRAW_OPTIONS_TABS_LIST,
  PAYMENT_OPTIONS_TABS_LIST,
  WITHDRAW_STATUS_FILTER_CARD,
  WITHDRAW_STATUS_FILTER_BANK,
  FILE_SIZE,
  TXN_TYPE_AGENT,
};
export {
  regexContainCapitalLetter,
  regexContainNumber,
  regexContainSpecialCharacter,
  isValidFileType,
  // fileUploadLimit,
  // ~NOT
  regexNotContainWhitespace,
  regexNotContainWordPassword,
  renameKeys,
};
