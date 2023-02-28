import * as yup from "yup";
import {
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  exp0ContainWhitespace,
  isValidFileType,
  exp0ContainWordPassword,
} from "constants/all";

const emailSchema = yup
  .string()
  .email("Please enter a valid email.")
  .required("Please enter a valid email.");

const passwordSchema = yup
  .string()
  .required("Password can't be null")
  .min(8, "Must contain 8 characters")
  .max(16, "Maximum limit 16 characters")
  .matches(exp0ContainWordPassword, "Should not contain word 'password'")
  .matches(exp0ContainWhitespace, "Whitespace is not allowed")
  .matches(expContainCapitalLetter, "Must contain one uppercase character")
  .matches(expContainNumber, "Must contain one number")
  .matches(expContainSpecialChar, "Must contain one special character");

const confirmPasswordSchema = yup
  .string()
  .oneOf([yup.ref("password"), null], "Password must Match")
  .required("confirm password can't be null");

const profileImageSchema = yup
  .mixed()
  .required("Profile image is required")
  .test({
    message: "Image type is not allowed",
    test: (file) => isValidFileType(file && file.name.toLowerCase(), "image"),
  });
// .test({
//   message: "File must not exceed 5 MB",
//   test: (file) => fileUploadLimit(file && file.size, "image"),
// });

const mobileSchema = yup
  .string()
  .min(10, "Mobile number must be 10 digits")
  .max(10, "Mobile number must be 10 digits")
  .matches(/^[0-9]*$/, "Enter a valid mobile number")
  .required("Mobile number is required");

export {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  profileImageSchema,
  mobileSchema,
};
