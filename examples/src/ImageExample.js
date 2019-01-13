import React, { Component } from "react";
import ReactInputPosition, {
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "../../src";
import ImageExampleRenderer from "./ImageExampleRenderer";
import ImageExampleControls from "./ImageExampleControls";
import SampleCode from "./SampleCode";

class ImageExample extends Component {
  state = {
    mouseActivation: MOUSE_ACTIVATION.CLICK,
    touchActivation: TOUCH_ACTIVATION.TAP,
    cursorStyle: "zoom-in",
    cursorStyleActive: "move",
    centerItemOnActivatePos: true
  };

  handleMouseChange = e => {
    const value = e.target.value;
    this.setState(() => ({ mouseActivation: value }));
  };

  handleTouchChange = e => {
    const value = e.target.value;
    this.setState(() => ({ touchActivation: value }));
  };

  handleCenterChange = e => {
    const value = e.target.value;
    this.setState(() => ({ centerItemOnActivatePos: Boolean(value) }));
  };

  render() {
    const {
      mouseActivation,
      touchActivation,
      cursorStyle,
      cursorStyleActive,
      centerItemOnActivatePos
    } = this.state;

    return (
      <React.Fragment>
        <div className="image-example">
          <ReactInputPosition
            mouseActivationMethod={mouseActivation}
            touchActivationMethod={touchActivation}
            trackItemPosition
            itemPositionLimitBySize
            centerItemOnActivatePos={centerItemOnActivatePos}
            cursorStyle={cursorStyle}
            cursorStyleActive={cursorStyleActive}
            className="input-position"
          >
            <ImageExampleRenderer />
            <div className="image-tip">Drag to move while zoomed in.</div>
          </ReactInputPosition>
          <ImageExampleControls
            handleMouseChange={this.handleMouseChange}
            handleTouchChange={this.handleTouchChange}
            handleCenterChange={this.handleCenterChange}
            mouseMethod={mouseActivation}
            touchMethod={touchActivation}
          />
        </div>
        <SampleCode />
      </React.Fragment>
    );
  }
}

export default ImageExample;
