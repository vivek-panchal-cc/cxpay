import * as yup from "yup";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  profileImageSchema,
  mobileSchema,
  firstNameSchema,
  lastNameSchema,
  countrySchema,
  citySchema,
} from "./commonSchema";

const signUpPersonalAccountSchema = yup.object().shape({
  first_name: firstNameSchema.required("Please enter First name"),
  last_name: lastNameSchema.required("Please enter Last name"),
  user_type: yup.string().required(),
  personal_id: yup
    .string()
    // .required("Please enter ID")
    .matches(/^\S*$/, "Space is not allowed")
    .max(100, "Maximum limit exceeded"),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: countrySchema,
  city: citySchema,
  mobile_code: yup.string().required("required"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const signUpBusinessAccountSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Please enter Company name")
    .max(64, "Maximum limit is 64 characters"),
  user_type: yup.string().required(),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: countrySchema,
  city: citySchema,
  mobile_code: yup.string().required("required"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const enterPhoneSchema = yup.object().shape({
  mobile_number: mobileSchema,
  country_code: yup.string().required("Code is required"),
});

const loginWithOtpSchema = yup.object().shape({
  mobile_number: mobileSchema,
});

const verifyOtpSchema = yup.object().shape({
  user_otp: yup
    .string()
    .length(4, "OTP length must be 4 digits")
    .matches(/^[0-9]*$/, "OTP should be number")
    .required("OTP is required"),
});

const LoginSchema = yup.object().shape({
  user_name: mobileSchema,
  password: yup
    .string()
    .required("Please enter Password")
    .max(16, "Maximum limit is 16 characters"),
});

const verifyLoginOtpSchema = yup.object().shape({
  login_otp: yup
    .string()
    .length(4, "OTP length must be 4 digits")
    .matches(/^[0-9]*$/, "OTP should be number")
    .required("OTP is required"),
});

const editProfileBusinessUserSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Please enter Company name")
    .max(64, "Maximum limit is 64 characters"),
  user_type: yup.string().required(),
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  mobile_code: yup.string().required("required*"),
  profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});

const editProfilePersonalUserSchema = yup.object().shape({
  first_name: firstNameSchema.required("Please enter First name"),
  last_name: lastNameSchema.required("Please enter Last name"),
  personal_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(100, "Maximum limit is exceeded"),
  user_type: yup.string().required(),
  email: emailSchema,
  country: countrySchema,
  city: citySchema,
  mobile_code: yup.string().required("required"),
  profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});
const forgotPasswordSchema = yup.object().shape({
  mobile_number: mobileSchema,
});

const resetPasswordSchema = yup.object().shape({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
});

const addBusinessUrlSchema = yup.object().shape({
  business_url: yup
    .string()
    .required("Business url is required")
    .matches(
      /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
      "Business url is not valid"
    )
    .nullable(),
});

export {
  LoginSchema,
  enterPhoneSchema,
  verifyOtpSchema,
  signUpPersonalAccountSchema,
  signUpBusinessAccountSchema,
  verifyLoginOtpSchema,
  editProfileBusinessUserSchema,
  editProfilePersonalUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginWithOtpSchema,
  addBusinessUrlSchema,
};
