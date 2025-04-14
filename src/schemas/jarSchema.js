import { exp0ContainOnlySpace } from "constants/all";
import * as yup from "yup";

const getYesterDay = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
};

const compareDateTime = (tmSel, dtSel) => {
  const tmNow = new Date().getTime();
  const tmSch = new Date(`${dtSel.toDateString()} ${tmSel}`).getTime();
  const tmBuffer = tmNow + 1000 * 60 * 5;
  return tmSch <= tmBuffer ? false : true;
};

const addJarSchema = yup.object().shape({
  jar_name: yup
    .string()
    .required("Sub-account name is required")
    .max(100, "Maximum limit is 100 characters."),
  target_amount: yup
    .string()
    .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid target amount")
    .required("Please enter target amount"),
  target_date: yup.date().required("Target date is required").nullable(),
  jar_category_id: yup.string().required("Sub-account category is required"),
  jar_icon: yup.string().required("Please select sub-account category icon"),
  // members: yup.array().min(1, "Add atleast one member"),
});

const editJarSchema = yup.object().shape({
  jar_name: yup
    .string()
    .required("Sub-account name is required")
    .max(100, "Maximum limit is 100 characters."),
  target_amount: yup
    .string()
    .matches(/^[1-9]\d{0,6}(\.\d{1,2})?$/, "Please enter valid target amount")
    .required("Please enter target amount"),
  target_date: yup.date().required("Target date is required").nullable(),
  jar_category_id: yup.string().required("Sub-account category is required"),
  jar_icon: yup.string().required("Please select sub-account category icon"),
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
      .required("Please enter amount"),
    // .test("max-target-amount", "Exceeds target amount", function (value) {
    //   const wallet = this.parent || {};
    //   if (!wallet.target_amount) return true;
    //   return parseFloat(value) <= parseFloat(wallet.target_amount);
    // }),
  }),
});

const jarRecurringSchema = yup.object().shape({
  recurring_start_date: yup
    .date()
    .required("Start date is required")
    .nullable(),
  frequency: yup.string().required("Please select frequency"),
});

const jarSchedulePaymentSchema = yup.object().shape({
  date: yup
    .date()
    .min(getYesterDay(), "Date cannot be in the past")
    .required("Date is required"),
  time: yup
    .string()
    .test(
      "time_test",
      "You can schedule your payment 5 minutes from now",
      (value, context) => compareDateTime(value, context.parent.date)
    )
    .required("Time is required"),
  amount: yup
    .string()
    .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  specifications: yup
    .string()
    .matches(exp0ContainOnlySpace, "Space is not allowed")
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
});

const jarRecurringForUpdate = yup.object().shape({
  recurring_start_date: yup
    .date()
    .required("Start date is required")
    .nullable(),
  recurring_end_date: yup.date().required("End date is required").nullable(),
  frequency: yup.string().required("Please select frequency"),
  amount: yup
    .string()
    .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
  specifications: yup
    .string()
    .matches(exp0ContainOnlySpace, "Space is not allowed")
    .max(50, "Maximum limit is 50 characters.")
    .required("Please enter specifications"),
});

const setAmount = yup.object().shape({
  amount: yup
    .string()
    .matches(/^[1-9]\d*(\.\d+)?$/, "Please enter valid amount")
    .required("Please enter amount"),
});

export {
  addJarSchema,
  editJarSchema,
  jarCreateSchema,
  jarRecurringSchema,
  jarSchedulePaymentSchema,
  jarRecurringForUpdate,
  setAmount,
};
