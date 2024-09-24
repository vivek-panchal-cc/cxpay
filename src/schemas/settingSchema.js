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
  .matches(/^\d*$/, "PIN should be number")
  .test("no-all-zeros", "PIN cannot be all zeros", (value) => {
    return value !== "00000";
  })
  .test(
    "no-consecutive-numbers",
    "Consecutive numbers are not allowed",
    (value) => {
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

      return !isConsecutive(value) && !isReverseConsecutive(value);
    }
  );

const confirmPinSchema = yup
  .string()
  .required("Please enter confirm pin")
  .oneOf([yup.ref("new_pin"), null], "PIN must be matched");

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
    .matches(/^\d*$/, "PIN should be number")
    .length(5, "Old PIN length must be 5 digits"),
  new_pin: pinSchema,
  confirm_pin: confirmPinSchema,
});

export { passwordChangeSchema, pinChangeSchema };
