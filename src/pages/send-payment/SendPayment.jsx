import React, { useContext, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { SendPaymentContext } from "context/sendPaymentContext";
import ContactPaymentItem from "components/items/ContactPaymentItem";
import { sendPaymentSchema } from "schemas/sendPaymentSchema";

function SendPayment(props) {
  const {} = props;
  const inputAmountRefs = useRef([]);
  const { sendCreds } = useContext(SendPaymentContext);
  const { contacts } = sendCreds || [];

  const formik = useFormik({
    initialValues: sendCreds,
    validationSchema: sendPaymentSchema,
    onSubmit: async (values, { setValues, setErrors }) => {
      try {
      } catch (error) {}
    },
  });

  useEffect(() => {
    if ((!formik.isSubmitting && !formik.errors) || !formik.errors.contacts)
      return;
    const key = Object.keys(formik.errors.contacts)[0];
    console.log(formik.errors.contacts, key);
    inputAmountRefs?.[key]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [formik.isSubmitting]);

  return (
    <>
      <div class="col-12 send-payment-ttile-wrap">
        <div class="title-content-wrap send-pay-title-sec">
          <h3>One Time Payment</h3>
          <p>Please insert amount of money you want to send</p>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div class="one-time-pay-sec one-time-pay-wrap">
          <div class="one-time-pay-sec-inner-sec col-12">
            {/* <!-- one time payment block starts -->	*/}
            <div class="payment-blocks-wrap">
              <div class="payment-blocks-inner">
                {/* <!-- payment block form starts -->  */}
                {/* <!-- payment-blocks-listing starts --> */}
                <ul class="payment-blocks-listing">
                  {contacts.map((item, index) => {
                    return (
                      <ContactPaymentItem
                        name={item?.name}
                        imgUrl={item.profile_image}
                        key={index}
                        fieldName={`contacts[${index}].personal_amount`}
                        fieldValue={
                          formik.values?.contacts?.[index]?.personal_amount
                        }
                        fieldChange={formik.handleChange}
                        fieldOnBlur={formik.handleBlur}
                        fieldError={
                          formik.touched?.contacts?.[index]?.personal_amount &&
                          formik.errors?.contacts?.[index]?.personal_amount
                        }
                        ref={(el) => (inputAmountRefs[index] = el)}
                      />
                    );
                  })}
                </ul>
                {/* <!-- payment-blocks-listing close --> */}
                {/* <!-- payment blocks footer section starts --> */}
                <div class="payment-footer-block">
                  <ul>
                    <li>
                      <div class="payment-footer-col-label">Fees</div>
                      <h4 class="amount">
                        <span>NAFl</span> 00.00
                      </h4>
                    </li>
                    <li>
                      <div class="payment-footer-col-label">
                        Total Amount to charged
                      </div>
                      <h4 class="amount">
                        <span>NAFl</span> 00.00
                      </h4>
                    </li>
                    <li>
                      <div class="payment-footer-col-label">Dummy</div>
                      <h4 class="amount">
                        <span>NAFl</span> 00.00
                      </h4>
                    </li>
                    <li>
                      <div class="payment-footer-col-label">Total</div>
                      <div class="amount-currency-wrap">
                        <h4 class="amount">
                          <span>NAFl</span> 00.00
                        </h4>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* <!-- payment blocks footer section close --> */}

                {/* <!-- payment block form close -->   */}
              </div>
            </div>
            {/* <!-- one time payment block close -->	 */}
            <div class="pay-btn-wrap">
              <button href="#" class="btn btn-cancel-payment">
                Cancel
              </button>
              <button type="submit" class="btn btn-send-payment">
                Send
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default SendPayment;
