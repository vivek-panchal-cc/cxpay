import React from "react";

const SectionAmountDetails = (props) => {
  const { amount, articles = [] } = props;
  return (
    <section>
      <h5 className="fs-5">{amount} ANG</h5>
      {articles.map((item, index) => (
        <article key={item?.id || index}>
          <h5 className="fs-6">{item?.title}</h5>
          <p>{item?.description}</p>
        </article>
      ))}
    </section>
  );
};

export default SectionAmountDetails;
