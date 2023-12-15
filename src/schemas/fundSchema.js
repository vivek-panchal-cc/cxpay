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
import { isValidFileType } from "constants/all";

const FILE_SIZE = 5 * 1048576;
const FILE_COUNT = 3;

const yupWhenCard = (validations) => {
  return yup.mixed().when("txn_mode", {
    is: (txn_mode) => txn_mode === "CARD",
    then: () => validations,
  });
};

const yupWhenBank = (validations) => {
  return yup.mixed().when("txn_mode", {
    is: (txn_mode) => txn_mode === "BANK",
    then: () => validations,
  });
};

const yupWhenCash = "";

const cardNumberSchema2 = yup.string().when("card_id", {
  is: (card_id) => card_id && card_id > 0,
  then: () =>
    yup
      .string()
      .matches(/^\d*$/, "Card number is invalid")
      .min(4, "Card number is invalid")
      .required(),
  otherwise: () => cardNumberSchema.required("Please enter card number"),
});

const topUpDetailsSchema = yup.object().shape({
  transfer_amount: yup
    .string()
    .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  commission_type_id: yup.string().required("Please select payment type"),
  reference_id: yup.string().notRequired(),
});

const fundSchema = yup.object().shape({
  // email: emailSchema,
  // country: countrySchema,
  // city: citySchema,
  // transactionType: yup.string().required(),
  // transactionAmount: yup
  //   .string()
  //   .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
  //   .required("Please enter amount"),
  transactionAmount: yup
    .string()
    .matches(/^(0|[1-9]\d*)?(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  txn_mode: yup.string().required(),
  // Validations For CARD
  card_id: yupWhenCard(yup.number()),
  card_number: yupWhenCard(cardNumberSchema2),
  expiry_date: yupWhenCard(cardExpirySchema),
  security_code: yupWhenCard(cardCvvSchema),
  save_card: yupWhenCard(yup.boolean()),
  // Validations For BANK
  bank_id: yupWhenBank(yup.string()),
  account_type: yupWhenBank(yup.string()),
  bank_name: yupWhenBank(bankNameSchema),
  routing_number: yupWhenBank(routingNumberSchema),
  bank_account_number: yupWhenBank(bankNumberSchema),
  bank_holder_first_name: yupWhenBank(
    firstNameSchema.required("Please enter first name")
  ),
  bank_holder_last_name: yupWhenBank(
    lastNameSchema.required("Please enter last name")
  ),
  address: yupWhenBank(addressSchema),
  save_bank: yupWhenBank(yup.boolean()),
});

const fundSchemaWithoutCVV = yup.object().shape({
  transactionAmount: yup
    .string()
    .matches(/^(0|[1-9]\d*)?(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  txn_mode: yup.string().required(),
  // Validations For CARD
  card_id: yupWhenCard(yup.number()),
  card_number: yupWhenCard(cardNumberSchema2),
  expiry_date: yupWhenCard(cardExpirySchema),
  // security_code: yupWhenCard(cardCvvSchema),
  save_card: yupWhenCard(yup.boolean()),
  // Validations For BANK
  bank_id: yupWhenBank(yup.string()),
  account_type: yupWhenBank(yup.string()),
  bank_name: yupWhenBank(bankNameSchema),
  routing_number: yupWhenBank(routingNumberSchema),
  bank_account_number: yupWhenBank(bankNumberSchema),
  bank_holder_first_name: yupWhenBank(
    firstNameSchema.required("Please enter first name")
  ),
  bank_holder_last_name: yupWhenBank(
    lastNameSchema.required("Please enter last name")
  ),
  address: yupWhenBank(addressSchema),
  save_bank: yupWhenBank(yup.boolean()),
});

const fundCashCreditSchema = yup.object().shape({
  amount: yup
    .string()
    .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  specification: yup
    .string()
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
  fees: yup.string(),
  receipt: yup
    .mixed()
    .test({
      message: `Please upload receipt`,
      test: (files) => files.length > 0,
    })
    .test({
      message: `Maximum ${FILE_COUNT} files allowed`,
      test: (files) => files.length <= FILE_COUNT,
    })
    .test({
      message: "File type is not allowed",
      test: (files) => {
        for (const file of files)
          if (!isValidFileType(file.name?.toLowerCase(), "receipt"))
            return false;
        return true;
      },
    })
    .test({
      message: "Receipt must not exceed 5 mb size.",
      test: (files) => {
        for (const file of files) if (file.size > FILE_SIZE) return false;
        return true;
      },
    }),
});

export { fundSchema, fundSchemaWithoutCVV, fundCashCreditSchema, topUpDetailsSchema };
