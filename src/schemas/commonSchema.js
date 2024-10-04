import * as yup from "yup";
import {
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  exp0ContainWhitespace,
  isValidFileType,
  exp0ContainWordPassword,
  FILE_SIZE,
} from "constants/all";
import valid from "card-validator";

const emailSchema = yup
  .string()
  .email("Please enter a valid email")
  .required("Please enter email");

const passwordSchema = yup
  .string()
  .required("Please enter password")
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

const passwordStrengthSchema = yup
  .string()
  .min(8, "Password must contain 8 to 16 characters")
  .max(16, "Password must contain 8 to 16 characters")
  .matches(/^(?=.*[a-z])/, "At least one lowercase character")
  .matches(/^(?=.*[A-Z])/, "At least one uppercase character")
  .matches(/^(?=.*[0-9])/, "At least one numeric character")
  .matches(
    /^(?=.*[@$!%*?&#_])/,
    "At least one special character (@, $, !, %, *, ?, &, #, _)"
  )
  .matches(exp0ContainWhitespace, "Space is not allowed")
  .matches(exp0ContainWordPassword, `Word 'password' is not allowed`)
  .required("Password is required");

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
    message: "File type is not allowed",
    test: (file) =>
      file?.name ? isValidFileType(file.name?.toLowerCase(), "image") : true,
  })
  .test({
    message: "Profile picture must not exceed 5 mb size.",
    test: (file) => (file?.size ? file.size <= FILE_SIZE : true),
  });

const mobileSchema = yup
  .string()
  .min(6, "The mobile number must be between 6 and 7 digits")
  .max(7, "The mobile number must be between 6 and 7 digits")
  // .matches(/^\d*$/, "Enter a valid mobile number")
  .matches(/^(?!0+$)\d*$/, "Enter a valid mobile number")
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
  .matches(/^\d*$/, "Please enter a valid card number")
  .min(12, "Card number must between 12 to 16 digits")
  .max(16, "Card number must between 12 to 16 digits")
  .test(
    "test-number",
    "Please enter a valid card number",
    (value) => valid.number(value).isPotentiallyValid
  )
  .required("Please enter card number");

const cardExpirySchema = yup
  .string()
  .required("Please enter expiry date")
  .test(
    "test-expiry-date",
    "Please enter valid expiry date",
    (value) => valid.expirationDate(value, 10).isValid
  );

const cardCvvSchema = yup
  .string()
  .required("Please enter cvv")
  .test(
    "test-cvv",
    "Please enter valid cvv",
    (value) => valid.cvv(value, [3, 4]).isValid
  );

const billingAddressSchema = yup
  .string()
  .required("Please enter billing address")
  .max(55, "Address must not be greater than 55 characters.");

const addressSchema = yup
  .string()
  .required("Please enter address")
  .max(55, "Address must not be greater than 55 characters.");

const bankNameSchema = yup
  .string()
  .max(150, "Maximum limit is 150 characters.")
  .required("Please enter bank name");

const routingNumberSchema = yup
  .string()
  .max(9, "Maximum limit is 9 digits")
  .required("Please enter routing number")
  .matches(/^\d*$/, "Invalid routing number");

const swiftCodeSchema = yup
  .string()
  .min(8, "Minimum limit is 8 characters")
  .max(11, "Maximum limit is 11 characters")
  .required("Please enter swift code")
  .matches(/^[A-Z0-9]*$/, "Please enter a valid swift code");

const bankNumberSchema = yup
  .string()
  .max(18, "Maximum limit is 18 digits")
  .required("Please enter account number")
  .matches(/^\d*$/, "Invalid account number");

const countrySchema = yup.string().required("Please select country");

const citySchema = yup.string().required("Please select city");

const otpSchema = yup
  .string()
  .length(4, "OTP length must be 4 digits")
  .matches(/^\d*$/, "OTP should be number")
  .required("OTP is required");

const paymentPinSchema = yup
  .string()
  .length(5, "PIN length must be 5 digits")
  .matches(/^\d*$/, "Please enter your PIN. This field is required")
  .required("PIN is required");

const pinSchema = yup
  .string()
  .required("PIN is required")
  .length(5, "PIN length must be 5 digits")
  .matches(/^\d*$/, "Please enter your PIN. This field is required")
  .test(
    "no-all-zeros",
    "The PIN cannot be '00000'. Please enter a valid PIN",
    (value) => value !== "00000"
  )
  .test("no-consecutive-numbers", function (value) {
    if (!value) return true; // Skip validation if no value

    // Check for ascending consecutive numbers
    const isConsecutive = (str) => {
      for (let i = 1; i < str.length; i++) {
        if (parseInt(str[i]) !== parseInt(str[i - 1]) + 1) {
          return false;
        }
      }
      return true;
    };

    // Check for descending consecutive numbers
    const isReverseConsecutive = (str) => {
      for (let i = 1; i < str.length; i++) {
        if (parseInt(str[i]) !== parseInt(str[i - 1]) - 1) {
          return false;
        }
      }
      return true;
    };

    // Create the error message dynamically if a consecutive pattern is found
    if (isConsecutive(value) || isReverseConsecutive(value)) {
      return this.createError({
        path: this.path,
        message: `The PIN cannot be '${value}'. Please enter a valid PIN.`,
      });
    }

    return true;
  });

const confirmPinSchema = yup
  .string()
  .required("Please enter confirm pin")
  .oneOf([yup.ref("pin"), null], "The PIN and Confirm PIN must be same.");

const confirmNewPinSchema = yup
  .string()
  .required("Please enter confirm pin")
  .oneOf([yup.ref("new_pin"), null], "The PIN and Confirm PIN must be same.");

export {
  emailSchema,
  passwordSchema,
  passwordStrengthSchema,
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
  swiftCodeSchema,
  bankNumberSchema,
  countrySchema,
  citySchema,
  otpSchema,
  pinSchema,
  confirmPinSchema,
  confirmNewPinSchema,
  paymentPinSchema,
};
