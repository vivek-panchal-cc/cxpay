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
  .required("Please enter email.");

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
  .required("Please enter new password")
  .min(
    8,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .max(
    16,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .matches(
    exp0ContainWordPassword,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .matches(
    exp0ContainWhitespace,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .matches(
    expContainCapitalLetter,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .matches(
    expContainNumber,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  )
  .matches(
    expContainSpecialChar,
    "Password must contain at least one number, one uppercase & lowercase letter and one special character, and at least 8 or more characters"
  );

const confirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("password"), null], "Password must be matched")
  .required("Please enter confirm password");

const changeConfirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("new_password"), null], "Password must be matched")
  .required("Please enter confirm password");

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
  .min(10, "Mobile number must be 10 digits")
  .max(10, "Mobile number must be 10 digits")
  .matches(/^[0-9]*$/, "Enter a valid mobile number")
  .required("Please enter mobile number");

const firstNameSchema = yup
  .string()
  .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "First name is invalid")
  .max(35, "Maximum limit is 35 characters");

const lastNameSchema = yup
  .string()
  .matches(/^[ a-zA-Z\u00C0-\u00FF_@.\\/#&+-]*$/, "Last name is invalid")
  .max(35, "Maximum limit is 35 characters");

const cardNumberSchema = yup
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
  .required("Credit card number is required");

const cardExpirySchema = yup
  .string()
  .required("Expiry date is required")
  .test(
    "test-expiry-date",
    "Expiry date is invalid",
    (value) => valid.expirationDate(value, 10).isValid
  );

const cardCvvSchema = yup
  .string()
  .required("Security code is required")
  .test(
    "test-cvv",
    "Security code is invalid",
    (value) => valid.cvv(value, [3, 4]).isValid
  );

const billingAddressSchema = yup
  .string()
  .required("Billing address is required")
  .max(55, "The billing address must not be greater than 55 characters.");

const addressSchema = yup
  .string()
  .required("Address is required")
  .max(55, "Address must not be greater than 55 characters.");

const bankNameSchema = yup
  .string()
  .max(150, "Maximum limit is 150 characters.")
  .required("Bank name is required.");

const routingNumberSchema = yup
  .string()
  .max(9, "Maximum limit is 9 digits")
  .required("Routing number is required.")
  .matches(/^[0-9]*$/, "Invalid routing number");

const bankNumberSchema = yup
  .string()
  .max(18, "Maximum limit is 18 digits")
  .required("Account number is required.")
  .matches(/^[0-9]*$/, "Invalid account number");

const countrySchema = yup.string().required("Please select country");

const citySchema = yup.string().required("Please select city");

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
