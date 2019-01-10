import React from "react";

const image = require("./sample-image.jpg");

const ImageExampleRenderer = props => {
  const {
    itemRef,
    itemPosition,
    active
  } = props;

  return (
    <React.Fragment>
      <img
        src={image}
        alt="Tiger"
        className={`small-image ${active ? "" : "show"}`}
      />
      <img
        ref={itemRef}
        src={image}
        alt="Magnified Tiger"
        style={{
          transform: `translate(${itemPosition.x}px, ${itemPosition.y}px)`
        }}
        className="large-image"
      />
    </React.Fragment>
  );
};

export default ImageExampleRenderer;