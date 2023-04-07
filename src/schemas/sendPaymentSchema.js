import * as yup from "yup";

const sendPaymentSchema = yup.object().shape({
  contacts: yup.array().of(
    yup.object().shape({
      personal_amount: yup.string().required("Field is required"),
    })
  ),
});

export { sendPaymentSchema };
