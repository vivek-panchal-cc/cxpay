import * as yup from "yup";
import valid from "card-validator";
import { isValidFileType } from "constants/all";
import { emailSchema } from "./commonSchema";

const addCardSchema = yup.object().shape({
  card_number: yup
    .string()
    .matches(
      /^[0-9]*$/,
      "Credit card number is invalid. Card number must between 12 to 16 digits"
    )
    .min(12, "Credit card number is invalid")
    .max(16, "Credit card number is invalid")
    .test(
      "test-number",
      "Credit card number is invalid",
      (value) => valid.number(value).isPotentiallyValid
    )
    .required("Credit card number is required"),
  expiry_date: yup
    .string()
    .required("Expiry date is required")
    .test(
      "test-expiry-date",
      "Expiry date is invalid",
      (value) => valid.expirationDate(value, 10).isValid
    ),
  security_code: yup
    .string()
    .required("Security code is required")
    .test(
      "test-security-code",
      "Security code is invalid",
      (value) => valid.cvv(value).isValid
    ),
  card_holder_first_name: yup
    .string()
    .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "First name is invalid"),
  card_holder_last_name: yup
    .string()
    .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "Last name is invalid"),
  email: emailSchema,
  billing_address: yup
    .string()
    .required("Billing address is required")
    .max(55, "The billing address must not be greater than 55 characters."),
  country: yup.string().required("Please select country"),
  city: yup.string().required("Please select city"),
  color: yup.string(),
});

const linkBankSchema = yup.object().shape({
  account_type: yup.string(),
  bank_name: yup
    .string()
    .max(150, "Maximum limit is 150 characters.")
    .required("Bank name is required."),
  routing_number: yup
    .string()
    .max(9, "Maximum limit is 9 digits")
    .required("Routing number is required.")
    .matches(/^[0-9]*$/, "Invalid routing number"),
  bank_number: yup
    .string()
    .max(18, "Maximum limit is 18 digits")
    .required("Account number is required.")
    .matches(/^[0-9]*$/, "Invalid account number"),
  bank_holder_first_name: yup
    .string()
    .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "First name is invalid"),
  bank_holder_last_name: yup
    .string()
    .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "Last name is invalid"),
  email: emailSchema,
  country: yup.string().required("Please select country"),
  city: yup.string().required("Please select city"),
});

const uploadCardImageSchema = yup.object().shape({
  card_image: yup.mixed().test({
    message: "File Type is not allowed",
    test: (file) =>
      file && file.name
        ? isValidFileType(file && file.name.toLowerCase(), "image")
        : false,
  }),
});

const EditCardSchema = yup.object().shape({
  id: yup.string().required("Credit card-id is required"),
  email: emailSchema,
  country: yup.string().required("Please select country"),
  city: yup.string().required("Please select city"),
  color: yup.string(),
});

const EditBankSchema = yup.object().shape({
  id: yup.string().required("Bank-id is required"),
  email: emailSchema,
  country: yup.string().required("Please select country"),
  city: yup.string().required("Please select city"),
});

export {
  addCardSchema,
  linkBankSchema,
  uploadCardImageSchema,
  EditCardSchema,
  EditBankSchema,
};
