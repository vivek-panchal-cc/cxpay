import * as yup from "yup";

const sendPaymentSchema = yup.object().shape({
  wallet: yup.array().of(
    yup.object().shape({
      specifications: yup.string().max(50, "Maximum limit is 50 characters."),
      personal_amount: yup
        .string()
        .matches(
          /^[1-9][0-9]{0,5}(\.[0-9]{1,2})?$/,
          "Please enter valid amount"
        )
        .required("Please enter amount"),
    })
  ),
});

export { sendPaymentSchema };
