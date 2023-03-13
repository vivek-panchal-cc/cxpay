import * as yup from "yup";
import {
  changeConfirmPasswordSchema,
  emailSchema,
  passwordSchema,
} from "./commonSchema";

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: yup.string().required("Please enter old password"),
  new_password: passwordSchema,
  confirm_password: changeConfirmPasswordSchema,
});

export { passwordChangeSchema };
