import * as yup from "yup";
import valid from "card-validator";

const addCardSchema = yup.object().shape({
  card_number: yup
    .string()
    .required("Credit card number is required*")
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
      (value) => valid.expirationDate(value).isValid
    ),
  security_code: yup
    .string()
    .required("required*")
    .test(
      "test-expiry-date",
      "Security code is invalid",
      (value) => valid.cvv(value).isValid
    ),
  billing_address: yup.string().required("Billing address is required*"),
  color: yup.string().required(""),
});

export { addCardSchema };
