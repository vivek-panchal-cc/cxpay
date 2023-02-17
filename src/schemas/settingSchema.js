import * as yup from "yup";
import { emailSchema, passwordSchema } from "./commonSchema";

const passwordChangeSchema = yup.object().shape({
  email: emailSchema,
  current_password: yup.string().required("required*").max(30),
  new_password: passwordSchema,
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Password must Match")
    .required("confirm password can't be null"),
});

export { passwordChangeSchema };
