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
    .required("required*")
    .max(35, "Maximum limit 35 characters"),
  last_name: yup
    .string()
    .required("required*")
    .max(35, "Maximum limit 35 characters"),
  user_type: yup.string().required(),
  user_app_id: yup.string().required("required*"),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: yup.string().required("required*"),
  mobile_code: yup.string().required("required*"),
  city: yup.string().required("required*"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const signUpBusinessAccountSchema = yup.object().shape({
  company_name: yup.string().required("required*"),
  user_type: yup.string().required(),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: yup.string().required("required*"),
  mobile_code: yup.string().required("required*"),
  city: yup.string().required("required*"),
  // mobile_number: yup.string().required("Mobile number is required"),
});

const enterPhoneSchema = yup.object().shape({
  mobile_number: mobileSchema,
  country_code: yup.string().required("required*"),
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
    .required("Password can't be null")
    .max(16, "Maximum limit 16 characters"),
});

const verifyLoginOtpSchema = yup.object().shape({
  login_otp: yup
    .string()
    .length(4, "OTP length must be 4 digits")
    .matches(/^[0-9]*$/, "OTP should be number")
    .required("OTP is required"),
});

const editProfileBusinessUserSchema = yup.object().shape({
  company_name: yup.string().required("required*"),
  user_type: yup.string().required(),
  email: emailSchema,
  country: yup.string().required("required*"),
  mobile_code: yup.string().required("required*"),
  city: yup.string().required("required*"),
  profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});

const editProfilePersonalUserSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("required*")
    .max(35, "Maximum limit 35 characters"),
  last_name: yup
    .string()
    .required("required*")
    .max(35, "Maximum limit 35 characters"),
  personal_id: yup.string(),
  user_type: yup.string().required(),
  email: emailSchema,
  country: yup.string().required("required*"),
  mobile_code: yup.string().required("required*"),
  city: yup.string().required("required*"),
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

const linkBankSchema = yup.object().shape({
  routing_number: yup.string().required("Routing number is required."),
  bank_number: yup.string().required("Account number is required."),
});

const addBusinessUrlSchema = yup.object().shape({
  business_url: yup
    .string()
    .matches(
      /^((http|https):\/\/)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
      "Business url is not valid"
    )
    .required("Business url is required"),
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
  linkBankSchema,
  loginWithOtpSchema,
  addBusinessUrlSchema,
};
