import React, { useContext, useEffect, useState } from "react";
import { useFaq } from "context/faqContext";
import { IconMinusFaq, IconPlusFaq } from "styles/svgs";
import "./faq-content.css";

const FaqSkeleton = () => (
  <div className="accordion-wrapper">
    <div className="accordion">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="accordion-item skeleton-item">
          <div className="accordion-title-wrapper">
            <div className="skeleton skeleton-title"></div>
          </div>
          <div className="skeleton skeleton-content"></div>
        </div>
      ))}
    </div>
  </div>
);

const FaqContent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { faqList, listIsLoading } = useFaq();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="contact-sec">
          <div className="contact-top-sec">
            <div className="title-content-wrap">
              <h3>FAQs</h3>
            </div>
          </div>
          {listIsLoading ? (
            <FaqSkeleton />
          ) : (
            <div className="accordion-wrapper">
              <div className="accordion">
                {faqList?.map((item, index) => (
                  <div
                    key={index}
                    className={`accordion-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="accordion-title-wrapper">
                      <label className="accordion-title">
                        {item.faq_question}
                      </label>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAccordion(index);
                        }}
                      >
                        {activeIndex === index ? (
                          <IconMinusFaq className="minus-icon" />
                        ) : (
                          <IconPlusFaq />
                        )}
                      </div>
                    </div>
                    <div
                      className={`accordion-content ${
                        activeIndex === index ? "show" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: item.faq_answer }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!listIsLoading && faqList?.length <= 0 ? (
            <p className="text-center">Content not available.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FaqContent;
