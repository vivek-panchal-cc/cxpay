import { url_regex } from "constants/all";
import * as yup from "yup";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  profileImageSchema,
  mobileSchema,
} from "./commonSchema";

const signUpPersonalAccountSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("Please enter first name")
    .max(35, "Maximum limit is 35 characters"),
  last_name: yup
    .string()
    .required("Please enter last name")
    .max(35, "Maximum limit is 35 characters"),
  user_type: yup.string().required(),
  personal_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(100, "Maximum limit exceeded"),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: yup.string().required("Please select country"),
  mobile_code: yup.string().required("required"),
  city: yup.string().required("Please select city"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const signUpBusinessAccountSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Please enter business name")
    .max(64, "Maximum limit is 64 characters"),
  user_type: yup.string().required(),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: yup.string().required("Please select country"),
  mobile_code: yup.string().required("required"),
  city: yup.string().required("Please select city"),
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
    .required("Please enter password.")
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
    .required("Please enter company name")
    .max(64, "Maximum limit is 64 characters"),
  user_type: yup.string().required(),
  email: emailSchema,
  country: yup.string().required("Please select country"),
  mobile_code: yup.string().required("required*"),
  city: yup.string().required("Please select city"),
  profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});

const editProfilePersonalUserSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("Please enter first name")
    .max(35, "Maximum limit is 35 characters"),
  last_name: yup
    .string()
    .required("Please enter last name")
    .max(35, "Maximum limit is 35 characters"),
  personal_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(100, "Maximum limit is exceeded"),
  user_type: yup.string().required(),
  email: emailSchema,
  country: yup.string().required("Please select country"),
  mobile_code: yup.string().required("required"),
  city: yup.string().required("Please select city"),
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
    .matches(url_regex, "Business url is not valid")
    .nullable(),
});

const inviteContactSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email"),
  mobile: yup
    .string()
    .min(6, "Mobile number must be 6 or 7 digits")
    .max(7, "Mobile number must be 6 or 7 digits")
    .matches(/^[0-9]*$/, "Enter a valid mobile number")
    .required("Please enter mobile number"),
});

const businessInfoSchema = yup.object().shape({
  business_url: yup.string().matches(url_regex, "Business url is not valid"),
  business_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(25, "Maximum limit exceeded"),
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
  inviteContactSchema,
  addBusinessUrlSchema,
  businessInfoSchema,
};
