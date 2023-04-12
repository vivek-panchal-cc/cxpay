import { url_regex } from "constants/all";
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
  addressSchema,
} from "./commonSchema";

const signUpPersonalAccountSchema = yup.object().shape({
  first_name: firstNameSchema.required("Please enter First name"),
  last_name: lastNameSchema.required("Please enter Last name"),
  user_type: yup.string().required(),
  personal_id: yup
    .string()
    .matches(/^\S*$/, "Space is not allowed")
    .max(100, "Maximum limit exceeded"),
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: countrySchema,
  city: citySchema,
  country_code: yup.string().required("required"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const signUpBusinessAccountSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Please enter Company name")
    .max(64, "Maximum limit is 64 characters"),
  user_type: yup.string().required(),
  email: emailSchema,
  address: addressSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: countrySchema,
  city: citySchema,
  country_code: yup.string().required("required"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const enterPhoneSchema = yup.object().shape({
  mobile_number: mobileSchema,
  country_code: yup.string().required("Code is required"),
});

const loginWithOtpSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
  mobile_number: mobileSchema,
});

const verifyOtpSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
  user_otp: yup
    .string()
    .length(4, "OTP length must be 4 digits")
    .matches(/^[0-9]*$/, "OTP should be number")
    .required("OTP is required"),
});

const LoginSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
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
  address: addressSchema,
  country: countrySchema,
  city: citySchema,
  country_code: yup.string().required("required*"),
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
  address: addressSchema,
  country: countrySchema,
  city: citySchema,
  country_code: yup.string().required("required"),
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
    .required("Please enter business URL")
    // .matches(url_regex, "Please enter valid business URL")
    .nullable(),
});

const inviteContactSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email"),
  mobile: yup
    .string()
    .min(6, "The mobile number must be between 6 and 7 digits")
    .max(7, "The mobile number must be between 6 and 7 digits")
    .matches(/^[0-9]*$/, "Please enter valid mobile number.")
    .required("Please enter mobile number"),
});

const businessInfoSchema = yup.object().shape({
  business_url: yup.string(),
  // .matches(url_regex, "Please enter valid business URL"),
  business_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(25, "Business ID must not be greater than 25 characters."),
});

const createGroupSchema = yup.object().shape({
  group_image: profileImageSchema,
  group_name: yup
    .string()
    .required("Group name is required")
    .max(55, "Maximum limit is 55 characters"),
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
  createGroupSchema,
};
