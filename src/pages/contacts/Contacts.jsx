import React, { useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { linkBankSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { IconSearch } from "styles/svgs";

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
    <div class="container-fluid">
      <div class="row">
        <div class="contact-sec">
          <div class="contact-top-sec">
            <div class="title-content-wrap">
              <h3>Contacts</h3>
              <p>Lorem Ipsum Dolor Sit Amet</p>
            </div>
          </div>
          <div class="contact-top-search-sec d-flex align-items-center">
            <div class="contact-serch-main">
              <form>
                <div class="form-field search-field">
                  <input
                    type="search"
                    class="form-control"
                    name="search-field"
                    placeholder="Search..."
                  />
                  <div class="search-btn">
                    <IconSearch />
                  </div>
                </div>
              </form>
            </div>
            <div class="contact-top-btn-nav">
              <div class="con-btn-wrap con-add-btn-wrap">
                <a
                  href="/"
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#add-contact-popup"
                >
                  <img src="images/Add_icon.svg" alt="" />
                  <span>Add Contact</span>
                </a>
              </div>
              <div class="con-btn-wrap con-remove-btn-wrap">
                <a
                  href="/"
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#invite-sent-popup"
                >
                  <img src="images/Remove_icon.svg" alt="" />
                  <span>Remove Contact</span>
                </a>
              </div>
              <div class="con-btn-wrap con-invite-btn-wrap">
                <a
                  href="/"
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#invite-contact-popup"
                >
                  <img src="images/Invite_icon.svg" alt="" />
                  <span>Invite Contact</span>
                </a>
              </div>
            </div>
          </div>
          <div class="con-listing-container">
            <ul class="contact-listing-wrap">
              <li>
                <div class="con-listing-info">
                  <div class="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div class="con-list-uname">Contact Name Display Here</div>
                </div>
                <div class="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div class="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div class="cont-listing-last-wrap">
                  <div class="con-listing-edit-wrap">
                    <a class="conlist-edit-a con-list-edit-star">
                      <img src="images/Star.svg" class="star_border" alt="" />
                      <img
                        src="images/star_fill.svg"
                        class="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="/" class="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div class="con-listing-btn-wrap">
                    <a href="/" class="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="/" class="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div class="con-listing-info">
                  <div class="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div class="con-list-uname">Contact Name Display Here</div>
                </div>
                <div class="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div class="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div class="cont-listing-last-wrap">
                  <div class="con-listing-edit-wrap">
                    <a class="conlist-edit-a con-list-edit-star">
                      <img src="images/Star.svg" class="star_border" alt="" />
                      <img
                        src="images/star_fill.svg"
                        class="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="" class="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div class="con-listing-btn-wrap">
                    <a href="#" class="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="#" class="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <div class="con-listing-info">
                  <div class="con-list-uimg">
                    <img src="images/activity-use-image02.jpg" alt="" />
                  </div>
                  <div class="con-list-uname">Contact Name Display Here</div>
                </div>
                <div class="con-listing-phone">
                  <p>+1 234 567 890</p>
                </div>
                <div class="con-listing-mail">
                  <p>abcdef@gmail.com</p>
                </div>
                <div class="cont-listing-last-wrap">
                  <div class="con-listing-edit-wrap">
                    <a class="conlist-edit-a con-list-edit-star">
                      <img src="images/Star.svg" class="star_border" alt="" />
                      <img
                        src="images/star_fill.svg"
                        class="star_fill"
                        alt=""
                      />
                    </a>
                    <a href="" class="conlist-edit-a">
                      <img src="images/Edit.svg" alt="" />
                    </a>
                  </div>
                  <div class="con-listing-btn-wrap">
                    <a href="#" class="btn btn-primary con-send-btn">
                      Send
                    </a>
                    <a href="#" class="btn btn-primary con-req-btn">
                      Request
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="pagination-wrap contact-pagination">
            <ul>
              <li class="page-item">
                <span class="page-link prev">PREV >></span>
              </li>
              <li class="page-item">
                <span class="page-link current">1</span>
              </li>
              <li class="page-item">
                <span class="page-link">2</span>
              </li>
              <li class="page-item">
                <span class="page-link">3</span>
              </li>
              <li class="page-item">
                <span class="page-link">4</span>
              </li>
              <li class="page-item">
                <span class="page-link skip">.....</span>
              </li>
              <li class="page-item">
                <span class="page-link last">12</span>
              </li>
              <li class="page-item">
                <span class="page-link next">NEXT >></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
