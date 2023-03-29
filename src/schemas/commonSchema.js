import * as yup from "yup";
import {
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  exp0ContainWhitespace,
  isValidFileType,
  exp0ContainWordPassword,
} from "constants/all";
import valid from "card-validator";

const FILE_SIZE = 5 * 1048576;

const emailSchema = yup
  .string()
  .email("Please enter a valid email")
  .required("Please enter Email");

// const passwordSchema = yup
//   .string()
//   .required("Please enter new Password")
//   .min(8, "Must contain 8 characters")
//   .max(16, "Maximum limit 16 characters")
//   .matches(exp0ContainWordPassword, "Should not contain word 'password'")
//   .matches(exp0ContainWhitespace, "Whitespace is not allowed")
//   .matches(expContainCapitalLetter, "Must contain one uppercase character")
//   .matches(expContainNumber, "Must contain one number")
//   .matches(expContainSpecialChar, "Must contain one special character");

const passwordSchema = yup
  .string()
  .required("Please enter Password")
  .min(
    8,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .max(
    16,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .matches(
    exp0ContainWordPassword,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .matches(
    exp0ContainWhitespace,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .matches(
    expContainCapitalLetter,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .matches(
    expContainNumber,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  )
  .matches(
    expContainSpecialChar,
    "Password must contain 8 to 16 characters and contain at least one number, one uppercase & lowercase letter and one special character."
  );

const confirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("password"), null], "Password must be matched")
  .required("Please enter Confirm Password");

const changeConfirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("new_password"), null], "Password must be matched")
  .required("Please enter Confirm Password");

const profileImageSchema = yup
  .mixed()
  .test({
    message: "File Type is not allowed",
    test: (file) =>
      file && file.name
        ? isValidFileType(file && file.name.toLowerCase(), "image")
        : true,
  })
  .test({
    message: "Profile picture must not exceed 5 MB size.",
    test: (file) => (file && file.size ? file.size <= FILE_SIZE : true),
  });

const mobileSchema = yup
  .string()
  .min(6, "The mobile number must be between 6 and 7 digits")
  .max(7, "The mobile number must be between 6 and 7 digits")
  .matches(/^[0-9]*$/, "Enter a valid mobile number")
  .required("Please enter mobile number");

const firstNameSchema = yup
  .string()
  .matches(/^[ a-zA-Z\u00C0-\u00FF_'@.\\/#&+-]*$/, "First name is invalid")
  .max(35, "Maximum limit is 35 characters");

const lastNameSchema = yup
  .string()
  .matches(/^[ a-zA-Z\u00C0-\u00FF_'@.\\/#&+-]*$/, "Last name is invalid")
  .max(35, "Maximum limit is 35 characters");

const cardNumberSchema = yup
  .string()
  .matches(/^[0-9]*$/, "Please enter a valid card number")
  .min(12, "Card number must between 12 to 16 digits")
  .max(16, "Card number must between 12 to 16 digits")
  .test(
    "test-number",
    "Please enter a valid card number",
    (value) => valid.number(value).isPotentiallyValid
  )
  .required("Please enter Card Number");

const cardExpirySchema = yup
  .string()
  .required("Please enter Expiry Date")
  .test(
    "test-expiry-date",
    "Please enter valid Expiry Date",
    (value) => valid.expirationDate(value, 10).isValid
  );

const cardCvvSchema = yup
  .string()
  .required("Please enter CVV")
  .test(
    "test-cvv",
    "Please enter valid CVV",
    (value) => valid.cvv(value, [3, 4]).isValid
  );

const billingAddressSchema = yup
  .string()
  .required("Please enter Billing address")
  .max(55, "The address must not be greater than 55 characters.");

const addressSchema = yup
  .string()
  .required("Please enter Address")
  .max(55, "Address must not be greater than 55 characters.");

const bankNameSchema = yup
  .string()
  .max(150, "Maximum limit is 150 characters.")
  .required("Please enter Bank name");

const routingNumberSchema = yup
  .string()
  .max(9, "Maximum limit is 9 digits")
  .required("Please enter Routing number")
  .matches(/^[0-9]*$/, "Invalid routing number");

const bankNumberSchema = yup
  .string()
  .max(18, "Maximum limit is 18 digits")
  .required("Please enter Account number")
  .matches(/^[0-9]*$/, "Invalid account number");

const countrySchema = yup.string().required("Please select Country");

const citySchema = yup.string().required("Please select City");

export {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  changeConfirmPasswordSchema,
  profileImageSchema,
  mobileSchema,
  firstNameSchema,
  lastNameSchema,
  cardNumberSchema,
  cardExpirySchema,
  cardCvvSchema,
  billingAddressSchema,
  addressSchema,
  bankNameSchema,
  routingNumberSchema,
  bankNumberSchema,
  countrySchema,
  citySchema,
};
