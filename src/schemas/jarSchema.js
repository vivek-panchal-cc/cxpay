import { exp0ContainOnlySpace } from "constants/all";
import * as yup from "yup";

const addJarSchema = yup.object().shape({
  jar_name: yup.string().required("Jar name is required"),
  target_amount: yup
    .string()
    .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid target amount")
    .required("Please enter target amount"),
  target_date: yup.date().required("Target date is required").nullable(),
  jar_category_id: yup.string().required("Jar category is required"),
  jar_icon: yup.string().required("Please select jar category icon"),
  // members: yup.array().min(1, "Add atleast one member"),
});

const editJarSchema = yup.object().shape({
  jar_name: yup.string().required("Jar name is required"),
  target_amount: yup
    .string()
    .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid target amount")
    .required("Please enter target amount"),
  target_date: yup.date().required("Target date is required").nullable(),
  jar_category_id: yup.string().required("Jar category is required"),
  jar_icon: yup.string().required("Please select jar category icon"),
});

// const jarCreateSchema = yup.object().shape({
//   wallet: yup.object().shape({
//     specifications: yup
//       .string()
//       .matches(exp0ContainOnlySpace, "Space is not allowed")
//       .max(50, "Maximum limit is 50 characters.")
//       .required("Please enter specifications"),
//     deposite_amount: yup
//       .string()
//       .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid amount")
//       .required("Please enter amount"),
//   }),
// });

const jarCreateSchema = yup.object().shape({
  wallet: yup.object().shape({
    specifications: yup
      .string()
      .matches(exp0ContainOnlySpace, "Space is not allowed")
      .max(50, "Maximum limit is 50 characters.")
      .required("Please enter specifications"),
    deposite_amount: yup
      .string()
      .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid amount")
      .required("Please enter amount")
      .test("max-target-amount", "Exceeds target amount", function (value) {
        const wallet = this.parent || {}; // Ensure parent exists
        if (!wallet.target_amount) return true; // Skip validation if target_amount is missing
        return parseFloat(value) <= parseFloat(wallet.target_amount);
      }),
  }),
});

const jarRecurringSchema = yup.object().shape({
  recurring_start_date: yup
    .date()
    .required("Start date is required")
    .nullable(),
  frequency: yup.string().required("Please select frequency"),
});

export { addJarSchema, editJarSchema, jarCreateSchema, jarRecurringSchema };
