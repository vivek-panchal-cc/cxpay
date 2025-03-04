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
});

export { addJarSchema };
