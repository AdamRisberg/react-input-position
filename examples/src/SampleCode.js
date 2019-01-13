import React from "react";

const SampleCode = () => {
  return (
    <div className="padding-20">
      <p className="margin-top-10">
        The following code shows how to achieve the above example. This is meant
        to be a quick, simple example. Only one image was used, but this could
        be used with two (small and large version). The image, while zoomed in,
        must be bigger than the container.
      </p>
      <pre className="sample-code">
        <code>
          {`import React from "react";
import ReactInputPosition, {
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-input-position";

const image = require("./sample-image.jpg");

const ImageRenderer = props => {
  const {
    itemRef,
    itemPosition,
    active
  } = props;

  return (
    <React.Fragment>
      <img
        src={image}
        style={{
          width: "100%",
          display: "block",
          visibility: active ? "hidden" : "visible"
        }} 
      />
      <img
        ref={itemRef}
        src={image}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: \`translate(\${itemPosition.x}px, \${itemPosition.y}px)\`,
          zIndex: "-1"
        }}
      />
    </React.Fragment>
  );
};

const SimpleMagnifierExample = () => {
  return (
    <ReactInputPosition
      mouseActivationMethod={MOUSE_ACTIVATION.CLICK}
      touchActivationMethod={TOUCH_ACTIVATION.TAP}
      trackItemPosition
      itemPositionLimitBySize
      centerItemOnActivatePos
      cursorStyle={"zoom-in"}
      cursorStyleActive={"move"}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ImageRenderer />
    </ReactInputPosition>
  );
};

export default SimpleMagnifierExample;`}
        </code>
      </pre>
    </div>
  );
};

export default SampleCode;
