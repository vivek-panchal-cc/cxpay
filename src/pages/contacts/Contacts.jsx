import React from "react";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { IconSearch } from "styles/svgs";
import { linkBankSchema } from "schemas/walletSchema";

const Contacts = (props) => {
  // const [accountType, setAccountType] = useState("current");

  // const handleChangeAccountType = (e) => {
  //   setAccountType(e.target.value);
  // };

  const formik = useFormik({
    initialValues: {
      bank_number: "",
      account_type: "",
      routing_number: "",
    },
    validationSchema: linkBankSchema,
    onSubmit: async (values, { resetForm, setStatus }) => {
      try {
        const { data } = await apiRequest.linkBank(values);
        console.log(data);
        if (!data.success || data.data === null) throw data.message;
      } catch (error) {
        resetForm();
        setStatus(error);
      }
    },
  });
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="contact-sec">
          <div className="contact-top-sec">
            <div className="title-content-wrap">
              <h3>Contacts</h3>
              <p>Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
          <div className="contact-top-search-sec d-flex align-items-center">
            <div className="contact-serch-main">
              <form>
                <div className="form-field search-field">
                  <input
                    type="search"
                    className="form-control"
                    name="search-field"
                    placeholder="Search..."
                  />
                  <div className="search-btn">
                    <IconSearch />
                  </div>
                </div>
              </form>
            </div>
            <div className="contact-top-btn-nav">
              <div className="con-btn-wrap con-add-btn-wrap">
                <a
                  href="/"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#add-contact-popup"
                >
                  <img src="images/Add_icon.svg" alt="" />
                  <span>Add Contact</span>
                </a>
              </div>
              <div className="con-btn-wrap con-remove-btn-wrap">
                <a
                  href="/"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#invite-sent-popup"
                >
                  <img src="images/Remove_icon.svg" alt="" />
                  <span>Remove Contact</span>
                </a>
              </div>
              <div className="con-btn-wrap con-invite-btn-wrap">
                <a
                  href="/"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#invite-contact-popup"
                >
                  <img src="images/Invite_icon.svg" alt="" />
                  <span>Invite Contact</span>
                </a>
              </div>
            </div>
          </div>
          <div className="con-listing-container">
            <ul className="contact-listing-wrap">
              <li>
                <div className="con-listing-info">
                  <div className="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div className="con-list-uname">
                    Contact Name Display Here
                  </div>
                </div>
                <div className="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div className="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div className="cont-listing-last-wrap">
                  <div className="con-listing-edit-wrap">
                    <a href="/" className="conlist-edit-a con-list-edit-star">
                      <img
                        src="images/Star.svg"
                        className="star_border"
                        alt=""
                      />
                      <img
                        src="images/star_fill.svg"
                        className="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="/" className="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div className="con-listing-btn-wrap">
                    <a href="/" className="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="/" className="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="con-listing-info">
                  <div className="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div className="con-list-uname">
                    Contact Name Display Here
                  </div>
                </div>
                <div className="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div className="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div className="cont-listing-last-wrap">
                  <div className="con-listing-edit-wrap">
                    <a href="/" className="conlist-edit-a con-list-edit-star">
                      <img
                        src="images/Star.svg"
                        className="star_border"
                        alt=""
                      />
                      <img
                        src="images/star_fill.svg"
                        className="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="/" className="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div className="con-listing-btn-wrap">
                    <a href="/" className="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="/" className="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div className="con-listing-info">
                  <div className="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div className="con-list-uname">
                    Contact Name Display Here
                  </div>
                </div>
                <div className="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div className="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div className="cont-listing-last-wrap">
                  <div className="con-listing-edit-wrap">
                    <a href="/" className="conlist-edit-a con-list-edit-star">
                      <img
                        src="images/Star.svg"
                        className="star_border"
                        alt=""
                      />
                      <img
                        src="images/star_fill.svg"
                        className="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="/" className="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div className="con-listing-btn-wrap">
                    <a href="/" className="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="/" className="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="pagination-wrap contact-pagination">
            <ul>
              <li className="page-item">
                <span className="page-link prev">PREV >></span>
              </li>
              <li className="page-item">
                <span className="page-link current">1</span>
              </li>
              <li className="page-item">
                <span className="page-link">2</span>
              </li>
              <li className="page-item">
                <span className="page-link">3</span>
              </li>
              <li className="page-item">
                <span className="page-link">4</span>
              </li>
              <li className="page-item">
                <span className="page-link skip">.....</span>
              </li>
              <li className="page-item">
                <span className="page-link last">12</span>
              </li>
              <li className="page-item">
                <span className="page-link next">NEXT >></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
