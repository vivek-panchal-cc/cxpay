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
    .matches(/[+-]?([0-9]*[.])?[0-9]+/, "Amount should be number")
    .required("Please enter amount"),
  txn_mode: yup.string().required(),
  // Validations For CARD
  card_id: yupWhenCard(yup.string()),
  card_number: yupWhenCard(cardNumberSchema2),
  expiry_date: yupWhenCard(cardExpirySchema),
  security_code: yupWhenCard(cardCvvSchema),
  card_holder_first_name: yupWhenCard(firstNameSchema),
  card_holder_last_name: yupWhenCard(lastNameSchema),
  billing_address: yupWhenCard(billingAddressSchema),
  save_card: yupWhenCard(yup.boolean()),
  // Validations For BANK
  bank_id: yupWhenBank(yup.string()),
  account_type: yupWhenBank(yup.string()),
  bank_name: yupWhenBank(bankNameSchema),
  routing_number: yupWhenBank(routingNumberSchema),
  bank_account_number: yupWhenBank(bankNumberSchema),
  bank_holder_first_name: yupWhenBank(firstNameSchema),
  bank_holder_last_name: yupWhenBank(lastNameSchema),
  address: yupWhenBank(addressSchema),
  save_bank: yupWhenBank(yup.boolean()),
});

export { fundSchema };
