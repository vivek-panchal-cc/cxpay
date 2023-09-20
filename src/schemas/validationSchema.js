import { MAX_GROUP_MEMBERS } from "constants/all";
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
  otpSchema,
} from "./commonSchema";

const signUpPersonalAccountSchema = yup.object().shape({
  first_name: firstNameSchema.required("Please enter first name"),
  last_name: lastNameSchema.required("Please enter last name"),
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
    .required("Please enter company name")
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
  mobile_number: mobileSchema,
  user_otp: otpSchema,
});

const verifyForgotPasswordOtpSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
  mobile_number: mobileSchema,
  user_otp: otpSchema,
});

const topUpSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
  mobile_number: mobileSchema,  
});

const LoginSchema = yup.object().shape({
  country_code: yup.string().required("Code is required"),
  user_name: mobileSchema,
  password: yup
    .string()
    .required("Please enter password")
    .max(16, "Maximum limit is 16 characters"),
});

const verifyLoginOtpSchema = yup.object().shape({
  login_otp: otpSchema,
});

const editProfileBusinessUserSchema = yup.object().shape({
  company_name: yup
    .string()
    .required("Please enter company name")
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
  first_name: firstNameSchema.required("Please enter first name"),
  last_name: lastNameSchema.required("Please enter last name"),
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
const editProfileAgentUserSchema = yup.object().shape({
  first_name: firstNameSchema.required("Please enter first name"),
  last_name: lastNameSchema.required("Please enter last name"),
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
  country_code: yup.string().required("Code is required"),
  mobile_number: mobileSchema,
});

const resetPasswordSchema = yup.object().shape({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
});

const addBusinessUrlSchema = yup.object().shape({
  business_url: yup
    .string()
    .required("Please enter business url")
    // .matches(url_regex, "Please enter valid business URL")
    .nullable(),
});

const inviteContactSchema = yup.object().shape({
  country_code: yup.string().required(""),
  email: emailSchema,
  mobile: yup
    .string()
    .min(6, "The mobile number must be between 6 and 7 digits")
    .max(7, "The mobile number must be between 6 and 7 digits")
    .matches(/^\d*$/, "Please enter valid mobile number.")
    .required("Please enter mobile number"),
});

const businessInfoSchema = yup.object().shape({
  business_url: yup.string(),
  // .matches(url_regex, "Please enter valid business URL"),
  business_id: yup
    .string()
    // .required("Please enter personal id")
    .matches(/^\S*$/, "Space is not allowed")
    .max(25, "Business id must not be greater than 25 characters."),
});

const createGroupSchema = yup.object().shape({
  group_image: profileImageSchema,
  group_name: yup
    .string()
    .required("Group name is required")
    .max(55, "Maximum limit is 55 characters"),
  contact: yup
    .array()
    .max(
      MAX_GROUP_MEMBERS,
      `Maximum ${MAX_GROUP_MEMBERS} members allowed in a group`
    ),
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
  editProfileAgentUserSchema,
  forgotPasswordSchema,
  verifyForgotPasswordOtpSchema,
  topUpSchema,
  resetPasswordSchema,
  loginWithOtpSchema,
  inviteContactSchema,
  addBusinessUrlSchema,
  businessInfoSchema,
  createGroupSchema,
};
