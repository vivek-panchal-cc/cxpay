import * as yup from "yup";
import {
  confirmPasswordSchema,
  emailSchema,
  passwordSchema,
  profileImageSchema,
} from "./commonSchema";

const signUpPersonalAccountSchema = yup.object().shape({
  first_name: yup.string().required("required*"),
  last_name: yup.string().required("required*"),
  user_type: yup.string().required(),
  user_app_id: yup.string().required("required*"),
  email: emailSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  profile_image: profileImageSchema,
  country: yup.string().required("required*"),
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
  // mobile_number: yup.string().required("Mobile number is required"),
});

const enterPhoneSchema = yup.object().shape({
  mobile_number: yup
    .string()
    .min(10, "Mobile number must be at least 10 characters")
    .max(10, "Mobile number must be at most 10 characters")
    .matches(/^[0-9]*$/, "Enter a valid mobile number")
    .required("Mobile number is required"),
});

const verifyOtpSchema = yup.object().shape({
  user_otp: yup
    .string()
    .length(4, "OTP length must be 4 digits")
    .matches(/^[0-9]*$/, "OTP should be number")
    .required("OTP is required"),
});

const LoginSchema = yup.object().shape({
  user_name: yup.string().required("Please enter email or phone"),
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

const editProfileSchema = yup.object().shape({
  company_name: yup.string().required("required*"),
  user_type: yup.string().required(),
  email: emailSchema,
  //profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});

const editProfilePersonalUserSchema = yup.object().shape({
  first_name: yup.string().required("required*"),
  last_name: yup.string().required("required*"),
  user_type: yup.string().required(),
  email: emailSchema,
  //profile_image: profileImageSchema,
  // mobile_number: yup.string().required("Mobile number is required"),
});
const forgotPasswordSchema = yup.object().shape({
  email: emailSchema,
  mobile_number: yup.string().required("required*"),
});

const resetPasswordSchema = yup.object().shape({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
});

const linkBankSchema = yup.object().shape({
  routing_number: yup.string().required("Routing number is required."),
  bank_number: yup.string().required("Account number is required."),
});

const inviteContactSchema = yup.object().shape({
  email: emailSchema,
  mobile: yup.string().required("Please enter mobile number."),
});

export {
  LoginSchema,
  enterPhoneSchema,
  verifyOtpSchema,
  signUpPersonalAccountSchema,
  signUpBusinessAccountSchema,
  verifyLoginOtpSchema,
  editProfileSchema,
  editProfilePersonalUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  linkBankSchema,
  inviteContactSchema,
};
