import * as yup from "yup";
import { otpSchema } from "./commonSchema";

const getYesterDay = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
};

const compareDateTime = (tmSel, dtSel) => {
  const tmNow = new Date().getTime();
  const tmSch = new Date(`${dtSel.toDateString()} ${tmSel}`).getTime();
  const tmBuffer = tmNow + 1000 * 60 * 5;
  return tmSch <= tmBuffer ? false : true;
};

const sendPaymentSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      specifications: yup
        .string()
        .max(50, "Maximum limit is 50 characters.")
        .required("Please enter specifications"),
      personal_amount: yup
        .string()
        .matches(/^[1-9]\d{0,5}(\.\d{1,2})?$/, "Please enter valid amount")
        .required("Please enter amount"),
    })
  ),
});

const sendRequestSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      specification: yup
        .string()
        .max(50, "Maximum limit is 50 characters.")
        .required("Please enter specifications"),
      amount: yup
        .string()
        .matches(/^[1-9]\d{0,5}(\.\d{1,2})?$/, "Please enter valid amount")
        .required("Please enter amount"),
    })
  ),
});

const schedulePaymentSchema = yup.object().shape({
  date: yup
    .date()
    .min(getYesterDay(), "Date cannot be in the past")
    .required("Date is required"),
  time: yup
    .string()
    .test(
      "time_test",
      "You can schedule your payment 5 minutes from now",
      (value, context) => compareDateTime(value, context.parent.date)
    )
    .required("Time is required"),
  specification: yup
    .string()
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
});

const sendPaymentOtpSchema = yup.object().shape({
  otp: otpSchema,
});

export {
  sendPaymentSchema,
  sendPaymentOtpSchema,
  sendRequestSchema,
  schedulePaymentSchema,
};
