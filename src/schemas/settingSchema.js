import * as yup from "yup";
import {
  changeConfirmPasswordSchema,
  emailSchema,
  passwordSchema,
  passwordStrengthSchema,
} from "./commonSchema";

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
  .oneOf([yup.ref("new_pin"), null], "The PIN and Confirm PIN must be same.");

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: yup.string().required("Please enter old password"),
  new_password: passwordStrengthSchema,
  confirm_password: changeConfirmPasswordSchema,
});

const pinChangeSchema = yup.object().shape({
  old_pin: yup
    .string()
    .required("Old PIN is required")
    .matches(/^\d*$/, "Please enter your PIN. This field is required")
    .length(5, "Old PIN length must be 5 digits"),
  new_pin: pinSchema,
  confirm_pin: confirmPinSchema,
});

export { passwordChangeSchema, pinChangeSchema };
