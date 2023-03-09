import * as yup from "yup";
import valid from "card-validator";
import { isValidFileType } from "constants/all";

const addCardSchema = yup.object().shape({
  card_number: yup
    .string()
    .matches(
      /^[0-9]*$/,
      "Your card number is invalid. Card number must between 12 to 16 digits"
    )
    .max(
      16,
      "Your card number is invalid. Card number must between 12 to 16 digits"
    )
    .required("Credit card number is required")
    .test(
      "test-number",
      "Credit card number is invalid",
      (value) => valid.number(value).isValid
    ),
  expiry_date: yup
    .string()
    .required("Expiry date is required*")
    .test(
      "test-expiry-date",
      "Expiry date is invalid",
      (value) => valid.expirationDate(value, 10).isValid
    ),
  card_holder_name: yup
    .string()
    .matches(/^[a-zA-Z ]*$/, "Card holder name in invalid"),
  billing_address: yup
    .string()
    .required("Billing address is required*")
    .max(55, "The billing address must not be greater than 55 characters."),
  color: yup.string().required(""),
});

const linkBankSchema = yup.object().shape({
  routing_number: yup
    .string()
    .required("Routing number is required.")
    .matches(/^[0-9]*$/, "Invalid routing number"),
  bank_number: yup
    .string()
    .max(18, "Maximum limit is 18 digits")
    .required("Account number is required.")
    .matches(/^[0-9]*$/, "Invalid account number"),
  bank_name: yup.string().required("Bank name is required."),
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

export { addCardSchema, linkBankSchema, uploadCardImageSchema };
