import * as yup from "yup";
import {
  changeConfirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "./commonSchema";

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: passwordSchema,
  new_password: passwordSchema,
  confirm_password: changeConfirmPasswordSchema,
});

export { passwordChangeSchema };
