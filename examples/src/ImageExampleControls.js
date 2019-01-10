import React from "react";
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from "../../src";

const ImageExampleControls = (props) => {
  const {
    handleMouseChange,
    handleTouchChange,
    handleCenterChange,
    mouseMethod,
    touchMethod
  } = props;

  return (
    <div className="controls">
      <label className="label">
        Mouse Activation Method:
        <select onChange={handleMouseChange}>
          <option value={MOUSE_ACTIVATION.CLICK}>Click</option>
          <option value={MOUSE_ACTIVATION.DOUBLE_CLICK}>Double Click</option>
        </select>
        <div className="note">{notes[mouseMethod]}</div>
      </label>
      <label className="label">
        Touch Activation Method:
        <select onChange={handleTouchChange}>
          <option value={TOUCH_ACTIVATION.TAP}>Tap</option>
          <option value={TOUCH_ACTIVATION.DOUBLE_TAP}>Double Tap</option>
          <option value={TOUCH_ACTIVATION.LONG_TOUCH}>Long Touch</option>
        </select>
        <div className="note">{notes[touchMethod]}</div>
      </label>
      <label>
        Center on Activation Position:
        <select onChange={handleCenterChange}>
          <option value={"true"}>True</option>
          <option value={""}>False</option>
        </select>
      </label>
    </div>
  );
};

const notes = {
  [MOUSE_ACTIVATION.CLICK]: "Click to zoom in/out",
  [MOUSE_ACTIVATION.DOUBLE_CLICK]: "Double click to zoom in/out.",
  [TOUCH_ACTIVATION.TAP]: "Tap to zoom in/out.",
  [TOUCH_ACTIVATION.DOUBLE_TAP]: "Double tap to zoom in/out.",
  [TOUCH_ACTIVATION.LONG_TOUCH]: "Touch for 1 second without moving to zoom in/out."
}

export default ImageExampleControls;