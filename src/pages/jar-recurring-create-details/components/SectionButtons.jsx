import Button from "components/ui/Button";
import React from "react";

const SectionButtons = (props) => {
  const { handleBack = () => {} } = props;

  return (
    <div className="wr-details-back-btn">
      <Button className="btn" onClick={handleBack}>
        Back
      </Button>
    </div>
  );
};

export default SectionButtons;
