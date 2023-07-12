import * as yup from "yup";
import { isValidFileType } from "constants/all";
import {
  addressSchema,
  bankNameSchema,
  bankNumberSchema,
  billingAddressSchema,
  cardExpirySchema,
  cardNumberSchema,
  citySchema,
  countrySchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  routingNumberSchema,
  swiftCodeSchema,
} from "./commonSchema";

const addCardSchema = yup.object().shape({
  card_number: cardNumberSchema,
  expiry_date: cardExpirySchema,
  security_code: yup.string(),
  card_holder_first_name: firstNameSchema.required("Please enter first name"),
  card_holder_last_name: lastNameSchema.required("Please enter last name"),
  email: emailSchema,
  billing_address: billingAddressSchema,
  country: countrySchema,
  city: citySchema,
  color: yup.string(),
});

const linkBankSchema = yup.object().shape({
  account_type: yup.string(),
  bank_name: bankNameSchema,
  swift_code: swiftCodeSchema,
  bank_number: bankNumberSchema,
  bank_holder_first_name: firstNameSchema.required("Please enter first name"),
  bank_holder_last_name: lastNameSchema.required("Please enter last name"),
  email: emailSchema,
  address: addressSchema,
  country: countrySchema,
  city: citySchema,
});

const uploadCardImageSchema = yup.object().shape({
  card_image: yup.mixed().test({
    message: "File type is not allowed",
    test: (file) =>
      file?.name ? isValidFileType(file?.name?.toLowerCase(), "image") : false,
  }),
});

const EditCardSchema = yup.object().shape({
  id: yup.string().required("Credit card-id is required"),
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  color: yup.string(),
  card_holder_first_name: firstNameSchema.required("Please enter first name"),
  card_holder_last_name: lastNameSchema.required("Please enter last name"),
  billing_address: billingAddressSchema,
});

const EditBankSchema = yup.object().shape({
  id: yup.string().required("Bank-id is required"),
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  address: addressSchema,
  bank_holder_first_name: firstNameSchema.required("Please enter first name"),
  bank_holder_last_name: lastNameSchema.required("Please enter last name"),
});

const withdrawCardSchema = yup.object().shape({
  card_number: yup.string().required(),
  card_expiry_date: cardExpirySchema,
  transaction_id: yup.string().required(),
  txn_source: yup.string().required(),
  amount: yup
    .string()
    .matches(/^\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  specification: yup
    .string()
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
});

const withdrawBankSchema = yup.object().shape({
  bank_id: yup.string(),
  bank_account_number: bankNumberSchema,
  bank_name: bankNameSchema,
  swift_code: swiftCodeSchema,
  account_type: yup.string(),
  amount: yup
    .string()
    .matches(/^\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  specification: yup
    .string()
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
  // user_date_time: yup.string().required(),
});

export {
  addCardSchema,
  linkBankSchema,
  uploadCardImageSchema,
  EditCardSchema,
  EditBankSchema,
  withdrawCardSchema,
  withdrawBankSchema,
};
