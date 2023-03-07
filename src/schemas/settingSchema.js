import * as yup from "yup";
import {
  changeConfirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "./commonSchema";

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: passwordSchema.required("Please enter old Password"),
  new_password: passwordSchema,
  confirm_password: changeConfirmPasswordSchema,
});

export { passwordChangeSchema };
