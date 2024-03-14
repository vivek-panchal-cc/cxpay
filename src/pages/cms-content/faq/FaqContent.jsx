import React, { useState } from "react";
import { IconPlusFaq } from "styles/svgs";
import "./faq-content.css";

const FaqContent = () => {
  const accordionData = [
    {
      title: "Section 1",
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
          laborum cupiditate possimus labore, hic temporibus velit dicta earum
          suscipit commodi eum enim atque at? Et perspiciatis dolore iure
          voluptatem.`,
    },
    {
      title: "Section 2",
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
          reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
          quaerat iure quos dolorum accusantium ducimus in illum vero commodi
          pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
          quidem maiores doloremque est numquam praesentium eos voluptatem amet!
          Repudiandae, mollitia id reprehenderit a ab odit!`,
    },
    {
      title: "Section 3",
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
          quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
          dolor ut sequi minus iste? Quas?`,
    },
    {
      title: "Section 4",
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
          quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
          dolor ut sequi minus iste? Quas?`,
    },
    {
      title: "Section 5",
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
          quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
          dolor ut sequi minus iste? Quas?`,
    },
    {
      title: "Section 6",
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
          quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
          dolor ut sequi minus iste? Quas?`,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      <h1>FAQ</h1>
      {accordionData.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${activeIndex === index ? "active" : ""}`}
          onClick={() => toggleAccordion(index)}
        >
          <label className="accordion-title">{item.title}</label>
          <div
            className={`accordion-content ${
              activeIndex === index ? "show" : ""
            }`}
          >
            {item.content}
          </div>
          <div
            className="accordion-toggle-icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion(index);
            }}
          >
            {activeIndex === index ? "" : <IconPlusFaq />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqContent;
