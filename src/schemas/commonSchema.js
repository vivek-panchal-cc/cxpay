import * as yup from "yup";
import {
  expContainCapitalLetter,
  expContainNumber,
  expContainSpecialChar,
  exp0ContainWhitespace,
  isValidFileType,
  exp0ContainWordPassword,
} from "constants/all";

const FILE_SIZE = 5 * 1048576;

const emailSchema = yup
  .string()
  .email("Please enter a valid email")
  .required("Email can't be null");

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
  .required("Please enter new Password")
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
  .oneOf([yup.ref("password"), null], "Password must Match")
  .required("Please enter confirm Password");

const profileImageSchema = yup
  .mixed()
  .test({
    message: "Image type is not allowed",
    test: (file) => isValidFileType(file && file.name.toLowerCase(), "image"),
  })
  .test({
    message: "File must not exceed 5 MB",
    test: (file) => {
      console.log(file ? file.size <= FILE_SIZE : false);
      return file ? file.size <= FILE_SIZE : false;
    },
  });

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
