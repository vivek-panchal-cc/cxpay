import * as yup from "yup";

const sendPaymentSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      personal_amount: yup
        .string()
        .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid Amount")
        .required("Field is required"),
    })
  ),
});

export { sendPaymentSchema };
