import React from "react";
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from "../../src";

const PropsExampleControls = props => {
  const {
    handleMouseChange,
    handleTouchChange,
    handleChange,
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
          <option value={MOUSE_ACTIVATION.HOVER}>Hover</option>
          <option value={MOUSE_ACTIVATION.MOUSE_DOWN}>Mouse Down</option>
        </select>
        <div className="note">{notes[mouseMethod]}</div>
      </label>
      <label className="label">
        Touch Activation Method:
        <select onChange={handleTouchChange}>
          <option value={TOUCH_ACTIVATION.TAP}>Tap</option>
          <option value={TOUCH_ACTIVATION.DOUBLE_TAP}>Double Tap</option>
          <option value={TOUCH_ACTIVATION.TOUCH}>Touch</option>
          <option value={TOUCH_ACTIVATION.LONG_TOUCH}>Long Touch</option>
        </select>
        <div className="note">{notes[touchMethod]}</div>
      </label>
      <div className="label-flex">
        <label className="label-left">
          Track Previous
          <select
            defaultValue={""}
            onChange={handleChange("trackPreviousPosition")}
          >
            <option value={"true"}>True</option>
            <option value={""}>False</option>
          </select>
        </label>
        <label className="label-right">
          Track Passive
          <select
            defaultValue={"true"}
            onChange={handleChange("trackPassivePosition")}
          >
            <option value={"true"}>True</option>
            <option value={""}>False</option>
          </select>
        </label>
      </div>
      <label className="label">
        Track Item Position
        <select defaultValue={""} onChange={handleChange("trackItemPosition")}>
          <option value={"true"}>True</option>
          <option value={""}>False</option>
        </select>
        <div className="note">
          Click/touch and drag while active to move item.
        </div>
      </label>
    </div>
  );
};

const notes = {
  [MOUSE_ACTIVATION.CLICK]: "Click to activate",
  [MOUSE_ACTIVATION.DOUBLE_CLICK]: "Double click to activate.",
  [MOUSE_ACTIVATION.HOVER]: "Hover to activate.",
  [MOUSE_ACTIVATION.MOUSE_DOWN]: "Click and hold to activate",
  [TOUCH_ACTIVATION.TAP]: "Tap to activate.",
  [TOUCH_ACTIVATION.TOUCH]: "Touch to activate.",
  [TOUCH_ACTIVATION.DOUBLE_TAP]: "Double tap to activate.",
  [TOUCH_ACTIVATION.LONG_TOUCH]:
    "Touch for 1 second without moving to activate."
};

export default PropsExampleControls;
