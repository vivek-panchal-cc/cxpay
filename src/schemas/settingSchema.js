import * as yup from "yup";
import {
  changeConfirmPasswordSchema,
  emailSchema,
  passwordSchema,
  passwordStrengthSchema,
} from "./commonSchema";

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: yup.string().required("Please enter old password"),
  new_password: passwordStrengthSchema,
  confirm_password: changeConfirmPasswordSchema,
});

export { passwordChangeSchema };
