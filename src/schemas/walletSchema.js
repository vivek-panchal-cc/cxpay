import * as yup from "yup";
import valid from "card-validator";

const addCardSchema = yup.object().shape({
  card_number: yup
    .string()
    .test(
      "test-number",
      "Credit card number is invalid",
      (value) => valid.number(value).isValid
    ),
  expiry_date: yup.string(), // mm-yyyy
  billing_address: yup.string(),
  security_code: yup.string(),
  color: yup.string(),
  image: yup.string(),
});

export { addCardSchema };
