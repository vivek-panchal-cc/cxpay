import * as yup from "yup";
import valid from "card-validator";
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
} from "./commonSchema";

const addCardSchema = yup.object().shape({
  card_number: cardNumberSchema,
  expiry_date: cardExpirySchema,
  security_code: yup.string(),
  card_holder_first_name: firstNameSchema,
  card_holder_last_name: lastNameSchema,
  email: emailSchema,
  billing_address: billingAddressSchema,
  country: countrySchema,
  city: citySchema,
  color: yup.string(),
});

const linkBankSchema = yup.object().shape({
  account_type: yup.string(),
  bank_name: bankNameSchema,
  routing_number: routingNumberSchema,
  bank_number: bankNumberSchema,
  bank_holder_first_name: firstNameSchema.required("First name is required."),
  bank_holder_last_name: lastNameSchema.required("Last name is required."),
  email: emailSchema,
  address: addressSchema,
  country: countrySchema,
  city: citySchema,
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
  country: countrySchema,
  city: citySchema,
  color: yup.string(),
  card_holder_first_name: firstNameSchema.required("First name is required."),
  card_holder_last_name: lastNameSchema.required("Last name is required."),
  billing_address: billingAddressSchema,
});

const EditBankSchema = yup.object().shape({
  id: yup.string().required("Bank-id is required"),
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  address: addressSchema,
  bank_holder_first_name: firstNameSchema.required("First name is required."),
  bank_holder_last_name: lastNameSchema.required("Last name is required."),
});

export {
  addCardSchema,
  linkBankSchema,
  uploadCardImageSchema,
  EditCardSchema,
  EditBankSchema,
};
