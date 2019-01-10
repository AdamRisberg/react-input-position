import React, { Component } from "react";

import ReactInputPosition, {
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "../../src";
import InputInfo from "./InputInfo";
import PropsExampleControls from "./PropsExampleControls";

class PropsExample extends Component {
  state = {
    mouseActivation: MOUSE_ACTIVATION.CLICK,
    touchActivation: TOUCH_ACTIVATION.TAP,
    trackPassivePosition: true,
    trackPreviousPosition: false,
    trackItemPosition: false
  };

  handleMouseChange = (e) => {
    const value = e.target.value;
    this.setState(() => ({ mouseActivation: value }));
  };

  handleTouchChange = (e) => {
    const value = e.target.value;
    this.setState(() => ({ touchActivation: value }));
  };

  handleChange = (key) => (e) => {
    const value = e.target.value;
    this.setState(() => ({ [key]: Boolean(value) }));
  };

  render() {
    const {
      mouseActivation,
      touchActivation,
      trackPreviousPosition,
      trackPassivePosition,
      trackItemPosition
    } = this.state;

    return (
      <div className="flex">
        <ReactInputPosition
          mouseActivationMethod={mouseActivation}
          touchActivationMethod={touchActivation}
          trackPreviousPosition={trackPreviousPosition}
          trackPassivePosition={trackPassivePosition}
          trackItemPosition={trackItemPosition}
          cursorStyle="default"
          cursorStyleActive="crosshair"
          className="input-position"
        >
          <InputInfo />
        </ReactInputPosition>
        <PropsExampleControls
          handleMouseChange={this.handleMouseChange}
          handleTouchChange={this.handleTouchChange}
          handleChange={this.handleChange}
          mouseMethod={mouseActivation}
          touchMethod={touchActivation}
        />
      </div>
    );
  }
}

export default PropsExample;