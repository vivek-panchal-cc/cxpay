import * as yup from "yup";
import {
  addressSchema,
  bankNameSchema,
  bankNumberSchema,
  billingAddressSchema,
  cardCvvSchema,
  cardExpirySchema,
  cardNumberSchema,
  citySchema,
  countrySchema,
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  routingNumberSchema,
} from "./commonSchema";

const yupWhenCard = (validations) => {
  return yup.mixed().when("txn_mode", {
    is: (txn_mode) => txn_mode === "CARD",
    then: validations,
  });
};

const yupWhenBank = (validations) => {
  return yup.mixed().when("txn_mode", {
    is: (txn_mode) => txn_mode === "BANK",
    then: validations,
  });
};

const yupWhenCash = "";

const cardNumberSchema2 = yup.string().when("card_id", {
  is: (card_id) => card_id && card_id.length > 0,
  then: yup
    .string()
    .matches(/^[0-9]*$/, "Credit card number is invalid")
    .min(4, "Credit card number is invalid")
    .required(),
  otherwise: cardNumberSchema.required("Please enter card number"),
});

const fundSchema = yup.object().shape({
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  transactionType: yup.string().required(),
  transactionAmount: yup
    .string()
    .matches(/[+-]?([0-9]*[.])?[0-9]+/, "Please enter valid Amount")
    .required("Please enter Amount"),
  txn_mode: yup.string().required(),
  // Validations For CARD
  card_id: yupWhenCard(yup.string()),
  card_number: yupWhenCard(cardNumberSchema2),
  expiry_date: yupWhenCard(cardExpirySchema),
  security_code: yupWhenCard(cardCvvSchema),
  card_holder_first_name: yupWhenCard(
    firstNameSchema.required("Please enter First name")
  ),
  card_holder_last_name: yupWhenCard(
    lastNameSchema.required("Please enter Last name")
  ),
  billing_address: yupWhenCard(billingAddressSchema),
  save_card: yupWhenCard(yup.boolean()),
  // Validations For BANK
  bank_id: yupWhenBank(yup.string()),
  account_type: yupWhenBank(yup.string()),
  bank_name: yupWhenBank(bankNameSchema),
  routing_number: yupWhenBank(routingNumberSchema),
  bank_account_number: yupWhenBank(bankNumberSchema),
  bank_holder_first_name: yupWhenBank(
    firstNameSchema.required("Please enter First name")
  ),
  bank_holder_last_name: yupWhenBank(
    lastNameSchema.required("Please enter Last name")
  ),
  address: yupWhenBank(addressSchema),
  save_bank: yupWhenBank(yup.boolean()),
});

export { fundSchema };
