import React from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { linkBankSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      <div className="dashboard-top-sec no-search-ontop">
        <div className="dashboard-notification-sec col-lg-5 col-12">
          <div className="notification-user-wrap">
            <div className="dashboard-notification-wrap">
              <div className="notification-icon">
                <svg
                  width="21"
                  height="22"
                  viewBox="0 0 21 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5303 16.3801H3.80029V8.4701C3.80029 4.6801 6.87029 1.6001 10.6703 1.6001C14.4603 1.6001 17.5403 4.6701 17.5403 8.4701V16.3801H17.5303Z"
                    stroke="#969696"
                    stroke-width="1.3"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M1.6001 16.3801H19.7301"
                    stroke="#969696"
                    stroke-width="1.3"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M12.6801 18.3701C12.6801 19.4801 11.7801 20.3901 10.6601 20.3901C9.54014 20.3901 8.64014 19.4901 8.64014 18.3701"
                    stroke="#969696"
                    stroke-width="1.3"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <span className="notification-count">
                  <span></span>
                </span>
              </div>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-image">
              <div className="user-image-wrap">
                <span className="user-image">
                  <img
                    src="assets/images/user-image-logged-in.png"
                    alt="user img"
                  />
                </span>
              </div>
              <ul>
                <li>
                  <a href="/">
                    <svg
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.02072 8.55317C11.1065 8.55317 12.7973 6.86233 12.7973 4.77658C12.7973 2.69083 11.1065 1 9.02072 1C6.93498 1 5.24414 2.69083 5.24414 4.77658C5.24414 6.86233 6.93498 8.55317 9.02072 8.55317Z"
                        stroke="#363853"
                        stroke-width="1.29114"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M15.9606 18.0001C16.6708 18.0001 17.2195 17.3115 16.9935 16.6229C15.9068 13.2551 12.7543 10.8127 9.02075 10.8127C5.28721 10.8127 2.13467 13.2551 1.04796 16.6229C0.832774 17.3007 1.37075 18.0001 2.08088 18.0001H15.9606Z"
                        stroke="#363853"
                        stroke-width="1.29114"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/">
                    <svg
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9635 16.4885L12.6638 15.9687L12.9635 16.4885ZM10.0489 17.8924L9.92389 17.3055L10.0489 17.8924ZM5.09207 16.4885L4.79236 17.0082H4.79236L5.09207 16.4885ZM8.00663 17.8924L8.13167 17.3055L8.00663 17.8924ZM16.8529 12.5678L16.2761 12.4028L16.8529 12.5678ZM13.1198 16.3983L13.4196 16.9181L13.1198 16.3983ZM15.6289 14.7132L15.1943 14.2995L15.6289 14.7132ZM13.1198 2.6017L13.4196 2.08192V2.08192L13.1198 2.6017ZM15.6289 4.28676L15.1943 4.70048L15.6289 4.28676ZM16.8529 6.4322L16.2761 6.59718L16.8529 6.4322ZM5.09207 2.51154L4.79236 1.99175V1.99175L5.09207 2.51154ZM8.00663 1.10765L8.13167 1.69447L8.00663 1.10765ZM12.9635 2.51154L12.6638 3.03132V3.03132L12.9635 2.51154ZM10.0489 1.10765L9.92388 1.69447L10.0489 1.10765ZM1 9.5H0.4H1ZM1.20263 6.4322L1.7795 6.59718L1.20263 6.4322ZM4.93571 2.6017L5.23542 3.12148H5.23542L4.93571 2.6017ZM2.42668 4.28676L1.99213 3.87303L2.42668 4.28676ZM1.20263 12.5678L0.625756 12.7328L1.20263 12.5678ZM4.93571 16.3983L5.23542 15.8785L5.23542 15.8785L4.93571 16.3983ZM2.42668 14.7132L1.99213 15.127L2.42668 14.7132ZM5.23542 3.12148L5.39178 3.03132L4.79236 1.99175L4.636 2.08192L5.23542 3.12148ZM12.6638 3.03132L12.8201 3.12148L13.4196 2.08192L13.2632 1.99176L12.6638 3.03132ZM12.8201 15.8785L12.6638 15.9687L13.2632 17.0082L13.4196 16.9181L12.8201 15.8785ZM5.39179 15.9687L5.23542 15.8785L4.636 16.9181L4.79236 17.0082L5.39179 15.9687ZM12.6638 15.9687C11.1931 16.8167 10.5704 17.1678 9.92389 17.3055L10.174 18.4792C11.0497 18.2926 11.8626 17.8158 13.2632 17.0082L12.6638 15.9687ZM4.79236 17.0082C6.19293 17.8158 7.00582 18.2926 7.88158 18.4792L8.13167 17.3055C7.4852 17.1678 6.86247 16.8167 5.39179 15.9687L4.79236 17.0082ZM9.92389 17.3055C9.33276 17.4315 8.7228 17.4315 8.13167 17.3055L7.88158 18.4792C8.63759 18.6403 9.41797 18.6403 10.174 18.4792L9.92389 17.3055ZM16.4556 9.5C16.4556 11.1087 16.4501 11.7944 16.2761 12.4028L17.4298 12.7328C17.6611 11.9241 17.6556 11.037 17.6556 9.5H16.4556ZM13.4196 16.9181C14.7252 16.1652 15.4864 15.733 16.0634 15.127L15.1943 14.2995C14.7651 14.7503 14.1891 15.0892 12.8201 15.8785L13.4196 16.9181ZM16.2761 12.4028C16.0716 13.1176 15.6998 13.7686 15.1943 14.2995L16.0634 15.127C16.7039 14.4542 17.1726 13.632 17.4298 12.7328L16.2761 12.4028ZM12.8201 3.12148C14.1891 3.91081 14.7651 4.24969 15.1943 4.70048L16.0634 3.87303C15.4864 3.26701 14.7252 2.83479 13.4196 2.08192L12.8201 3.12148ZM17.6556 9.5C17.6556 7.96302 17.6611 7.07587 17.4298 6.26722L16.2761 6.59718C16.4501 7.20561 16.4556 7.8913 16.4556 9.5H17.6556ZM15.1943 4.70048C15.6998 5.23136 16.0716 5.88242 16.2761 6.59718L17.4298 6.26722C17.1726 5.36804 16.7039 4.54578 16.0634 3.87303L15.1943 4.70048ZM5.39178 3.03132C6.86247 2.1833 7.4852 1.83223 8.13167 1.69447L7.88158 0.520823C7.00582 0.707439 6.19293 1.18417 4.79236 1.99175L5.39178 3.03132ZM13.2632 1.99176C11.8626 1.18417 11.0497 0.707439 10.174 0.520823L9.92388 1.69447C10.5704 1.83223 11.1931 2.1833 12.6638 3.03132L13.2632 1.99176ZM8.13167 1.69447C8.7228 1.56851 9.33275 1.56851 9.92388 1.69447L10.174 0.520823C9.41797 0.359726 8.63759 0.359726 7.88158 0.520823L8.13167 1.69447ZM1.6 9.5C1.6 7.8913 1.6055 7.20561 1.7795 6.59718L0.625755 6.26722C0.394497 7.07587 0.4 7.96302 0.4 9.5H1.6ZM4.636 2.08191C3.33032 2.83479 2.56911 3.26701 1.99213 3.87303L2.86122 4.70048C3.29041 4.24969 3.86651 3.91081 5.23542 3.12148L4.636 2.08191ZM1.7795 6.59718C1.98391 5.88242 2.35578 5.23136 2.86122 4.70048L1.99213 3.87303C1.35161 4.54578 0.882908 5.36803 0.625755 6.26722L1.7795 6.59718ZM0.4 9.5C0.4 11.037 0.394498 11.9241 0.625756 12.7328L1.7795 12.4028C1.6055 11.7944 1.6 11.1087 1.6 9.5H0.4ZM5.23542 15.8785C3.86651 15.0892 3.29041 14.7503 2.86122 14.2995L1.99213 15.127C2.56911 15.733 3.33032 16.1652 4.636 16.9181L5.23542 15.8785ZM0.625756 12.7328C0.882909 13.632 1.35161 14.4542 1.99213 15.127L2.86122 14.2995C2.35578 13.7686 1.98391 13.1176 1.7795 12.4028L0.625756 12.7328ZM9.02778 11.4716C7.98757 11.4716 7.1191 10.603 7.1191 9.5H5.9191C5.9191 11.2375 7.29697 12.6716 9.02778 12.6716V11.4716ZM10.9365 9.5C10.9365 10.603 10.068 11.4716 9.02778 11.4716V12.6716C10.7586 12.6716 12.1365 11.2375 12.1365 9.5H10.9365ZM9.02778 7.52838C10.068 7.52838 10.9365 8.397 10.9365 9.5H12.1365C12.1365 7.76246 10.7586 6.32838 9.02778 6.32838V7.52838ZM9.02778 6.32838C7.29697 6.32838 5.9191 7.76246 5.9191 9.5H7.1191C7.1191 8.397 7.98757 7.52838 9.02778 7.52838V6.32838Z"
                        fill="#363853"
                      ></path>
                    </svg>
                    Settings
                  </a>
                </li>
                <li>
                  <a href="/">
                    <svg
                      width="20"
                      height="19"
                      viewBox="0 0 20 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.9485 9.61107H7.88379"
                        stroke="#363853"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M16.2593 6.9314L18.9499 9.61096L16.2593 12.2905"
                        stroke="#363853"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M13.9575 5.48432C13.6543 2.19459 12.4229 1 7.52509 1C0.999843 1 0.999843 3.1227 0.999843 9.5C0.999843 15.8773 0.999843 18 7.52509 18C12.4229 18 13.6543 16.8054 13.9575 13.5157"
                        stroke="#363853"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
