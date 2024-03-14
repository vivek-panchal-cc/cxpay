import React, { useContext, useEffect, useState } from "react";
import { useFaq } from "context/faqContext";
import { IconMinusFaq, IconPlusFaq } from "styles/svgs";
import "./faq-content.css";

const FaqContent = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { faqList } = useFaq();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      <h1>FAQ</h1>
      {faqList?.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${activeIndex === index ? "active" : ""}`}
          onClick={() => toggleAccordion(index)}
        >
          <div className="accordion-title-wrapper">
            <label className="accordion-title">{item.faq_question}</label>
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
  );
};

export default FaqContent;