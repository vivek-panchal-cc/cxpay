import Button from "components/ui/Button";
import React from "react";

const SectionButtons = (props) => {
  const { handleBack = () => {} } = props;

  return (
    <div class="wr-details-back-btn">
      <Button class="btn" onClick={handleBack}>
        Back
      </Button>
    </div>
  );
};

export default SectionButtons;
