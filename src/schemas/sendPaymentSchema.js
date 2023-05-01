import * as yup from "yup";
import { otpSchema } from "./commonSchema";

const sendPaymentSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      specifications: yup.string().max(50, "Maximum limit is 50 characters."),
      personal_amount: yup
        .string()
        .matches(
          /^[1-9][0-9]{0,5}(\.[0-9]{1,2})?$/,
          "Please enter valid amount"
        )
        .required("Please enter amount"),
    })
  ),
});

const sendRequestSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      specifications: yup
        .string()
        .max(50, "Maximum limit is 50 characters.")
        .required("Please enter specifications"),
      amount: yup
        .string()
        .matches(
          /^[1-9][0-9]{0,5}(\.[0-9]{1,2})?$/,
          "Please enter valid amount"
        )
        .required("Please enter amount"),
    })
  ),
});

const sendPaymentOtpSchema = yup.object().shape({
  otp: otpSchema,
});

export { sendPaymentSchema, sendPaymentOtpSchema, sendRequestSchema };
