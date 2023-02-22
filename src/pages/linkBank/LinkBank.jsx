import React from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { linkBankSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IconContact, IconLogout, IconNotify, IconSetting } from "styles/svgs";

const LinkBank = (props) => {
  // const [accountType, setAccountType] = useState("current");

  // const handleChangeAccountType = (e) => {
  //   setAccountType(e.target.value);
  // };
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bank_number: "",
      account_type: "current",
      routing_number: "",
    },
    validationSchema: linkBankSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.linkBank(values);
        if (!data.success || data.data === null) throw data.message;
        toast.success(data.message);
        navigate("/setting");
      } catch (error) {
        toast.error(error);
        resetForm();
        setStatus(error);
      }
    },
  });
  return (
    <div>
      <div className="wallet-link-bank-bottom">
        <div className="profile-info rm-pl-profile-info">
          <h3>Link a Bank</h3>
          <ul className="breadcrumb">
            <li>
              <a href="/">Wallet</a>
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
                    placeholder={
                      formik.values.account_type === "savings"
                        ? "Saving Routing Number"
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
                <div className="btn-wrap">
                  <a href="/" className="btn outline-btn">
                    Cancel
                  </a>
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