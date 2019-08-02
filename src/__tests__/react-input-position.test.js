import React from "react";
import ReactInputPosition, {
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "../index";

import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const TestComponent = ({ itemRef }) => (
  <div ref={itemRef} className="test-component" />
);

const dispatchMouseEvent = (node, eventName) => {
  node.dispatchEvent(new MouseEvent(eventName, { clientX: 10, clientY: 10 }));
};

const dispatchClickEvent = node => {
  dispatchMouseEvent(node, "mousedown");
  dispatchMouseEvent(node, "mouseup");
};

describe("decorates children", () => {
  const expectedProps = {
    active: false,
    activePosition: { x: 0, y: 0 },
    prevActivePosition: { x: 0, y: 0 },
    passivePosition: { x: 0, y: 0 },
    elementDimensions: { width: 0, height: 0 },
    elementOffset: { left: 0, top: 0 },
    itemPosition: { x: 0, y: 0 },
    itemDimensions: { width: 0, height: 0 },
    refreshToggle: false,
    itemRef: expect.any(Object),
    onLoadRefresh: expect.any(Function)
  };

  const wrapper = mount(
    <ReactInputPosition>
      <TestComponent />
      <div className="test-div" />
    </ReactInputPosition>
  );

  it("decorates react components", () => {
    const childWrapper = wrapper.find(TestComponent);
    expect(childWrapper.props()).toEqual(expectedProps);
  });

  it("doesn't decorate dom elements", () => {
    const childWrapper = wrapper.find(".test-div");
    expect(childWrapper.props()).toEqual({ className: "test-div" });
  });
});

describe("mouse activation", () => {
  // Set minUpdateSpeedInMs to zero to account for the speed of test interactions
  const wrapper = mount(
    <ReactInputPosition
      className="test-class"
      minUpdateSpeedInMs={0}
      trackItemPosition
    >
      <TestComponent />
      <div className="test-div" />
    </ReactInputPosition>
  );

  const parentNode = wrapper.getDOMNode();

  it("activates by mouse click", () => {
    dispatchClickEvent(parentNode);
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by mouse click", () => {
    dispatchClickEvent(parentNode);
    expect(wrapper.state().active).toBe(false);
  });

  it("activates by double click", () => {
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.DOUBLE_CLICK
    });
    dispatchMouseEvent(parentNode, "dblclick");
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by double click", () => {
    dispatchMouseEvent(parentNode, "dblclick");
    expect(wrapper.state().active).toBe(false);
  });

  it("activates by hover", () => {
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.HOVER
    });
    dispatchMouseEvent(parentNode, "mouseenter");
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivate when mouse leaves", () => {
    dispatchMouseEvent(parentNode, "mouseleave");
    expect(wrapper.state().active).toBe(false);
  });

  it("activates on mouse down", () => {
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.MOUSE_DOWN
    });
    dispatchMouseEvent(parentNode, "mousedown");
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivate on mouse up", () => {
    dispatchMouseEvent(parentNode, "mouseup");
    expect(wrapper.state().active).toBe(false);
  });
});
