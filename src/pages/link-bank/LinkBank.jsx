import React, { useEffect } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { linkBankSchema } from "schemas/walletSchema";
// import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { IconLeftArrow } from "styles/svgs";

const LinkBank = (props) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bank_number: "",
      account_type: "current",
      routing_number: "",
      bank_name: "",
    },
    validationSchema: linkBankSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.linkBank(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/wallet/bank-list");
      } catch (error) {
        toast.error(error);
        setErrors({
          bank_number: error.bank_number?.[0],
          routing_number: error.routing_number?.[0],
          bank_name: error.bank_name?.[0],
        });
        resetForm();
        setStatus(error);
      }
    },
  });

  useEffect(() => {
    const type = formik.values.account_type;
    formik.resetForm();
    formik.setFieldValue("account_type", type);
  }, [formik.values.account_type]);

  return (
    <div>
      <div className="wallet-link-bank-bottom">
        <div className="profile-info rm-pl-profile-info">
          <h3>Link a Bank</h3>
          {/* <Breadcrumb /> */}
          <ul class="breadcrumb">
            <li>
              <a href="/wallet">Wallet</a>
            </li>
            <li>Link a Bank</li>
          </ul>
        </div>
        <div className="wallet-bank_link-form-wrap">
          <form
            id="form_saving_acc_op"
            className="wallet_acc_form"
            onSubmit={formik.handleSubmit}
          >
            <div className="radio-wrap">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="saving_acc_op"
                  name="account_type"
                  value={"savings"}
                  onChange={formik.handleChange}
                  // checked={formik.values.account_type === "savings"}
                  // defaultChecked
                />
                <label className="form-check-label" htmlFor="saving_acc_op">
                  Savings
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="current_acc_op"
                  name="account_type"
                  value={"current"}
                  onChange={formik.handleChange}
                  // checked={formik.values.account_type === "savings"}
                  defaultChecked
                />
                <label className="form-check-label" htmlFor="current_acc_op">
                  Current
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <div className="form-field">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Bank Name"
                    name="bank_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bank_name}
                    error={formik.touched.bank_name && formik.errors.bank_name}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <div className="form-field">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder={
                      formik.values.account_type === "savings"
                        ? "Routing Number"
                        : "Routing Number"
                    }
                    name="routing_number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.routing_number}
                    error={
                      formik.touched.routing_number &&
                      formik.errors.routing_number
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <div className="form-field">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Account Number"
                    name="bank_number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.bank_number}
                    error={
                      formik.touched.bank_number && formik.errors.bank_number
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-0 btns-inline">
                <div className="setting-btn-link btn-wrap">
                  <Link
                    to="/wallet/bank-list"
                    className="outline-btn w-100 text-center d-block"
                    replace
                  >
                    Cancel
                  </Link>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Link"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkBank;
