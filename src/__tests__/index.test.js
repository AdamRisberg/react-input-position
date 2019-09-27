import React from "react";
import ReactInputPosition, {
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
  defaultState
} from "../index";

import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const TestComponent = ({ itemRef, itemPosition }) => (
  <div
    ref={itemRef}
    className="test-component"
    style={{
      width: "500px",
      height: "500px",
      position: "absolute",
      transform: `translate(${itemPosition.x}px, ${itemPosition.y}px)`
    }}
  />
);

const dispatchMouseEvent = (node, eventName, coords = { x: 10, y: 10 }) => {
  node.dispatchEvent(
    new MouseEvent(eventName, { clientX: coords.x, clientY: coords.y })
  );
};

const dispatchClickEvent = node => {
  dispatchMouseEvent(node, "mousedown");
  dispatchMouseEvent(node, "mouseup");
};

const dispatchTouchEvent = (node, eventName) => {
  node.dispatchEvent(
    new TouchEvent(eventName, {
      touches: [{ clientX: 10, clientY: 10 }],
      changedTouches: [{ clientX: 10, clientY: 10 }]
    })
  );
};

const dispatchTapEvent = node => {
  dispatchTouchEvent(node, "touchstart");
  dispatchTouchEvent(node, "touchend");
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
    itemRef: expect.any(Object),
    onLoadRefresh: expect.any(Function)
  };

  const wrapper = mount(
    <ReactInputPosition
      minUpdateSpeedInMs={0}
      trackPassivePosition
      trackItemPosition
    >
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

describe("window event handlers", () => {
  it("adds event listeners on mount", () => {
    const addedHandlers = [];
    const addEventListenerSpy = jest
      .spyOn(window, "addEventListener")
      .mockImplementation((event, handler) => {
        addedHandlers.push({ event, handler });
      });

    const wrapper = mount(
      <ReactInputPosition
        minUpdateSpeedInMs={0}
        trackPassivePosition
        trackItemPosition
      >
        <TestComponent />
        <div className="test-div" />
      </ReactInputPosition>
    );

    expect(addedHandlers.filter(h => h.event === "resize")).toHaveLength(1);
    expect(addedHandlers.filter(h => h.event === "load")).toHaveLength(1);

    addEventListenerSpy.mockRestore();
    wrapper.unmount();
  });

  it("removes event listeners on unmount", () => {
    const removedHandlers = [];
    const removeEventListenerSpy = jest
      .spyOn(window, "removeEventListener")
      .mockImplementation((event, handler) => {
        removedHandlers.push({ event, handler });
      });

    const wrapper = mount(
      <ReactInputPosition
        style={{ width: "400px" }}
        minUpdateSpeedInMs={0}
        trackPassivePosition
        trackItemPosition
      >
        <TestComponent />
        <div className="test-div" />
      </ReactInputPosition>
    );

    wrapper.unmount();

    expect(removedHandlers.filter(h => h.event === "resize")).toHaveLength(1);
    expect(removedHandlers.filter(h => h.event === "load")).toHaveLength(1);

    removeEventListenerSpy.mockRestore();
  });
});

describe("mouse activation", () => {
  let wrapper;
  let parentNode;

  beforeEach(() => {
    wrapper = mount(
      <ReactInputPosition className="test-class" minUpdateSpeedInMs={0}>
        <TestComponent />
        <div className="test-div" />
      </ReactInputPosition>
    );

    parentNode = wrapper.getDOMNode();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("activates by mouse click", () => {
    dispatchClickEvent(parentNode);
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by mouse click", () => {
    wrapper.setState({ active: true });
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
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.DOUBLE_CLICK
    });
    wrapper.setState({ active: true });
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
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.HOVER
    });
    wrapper.setState({ active: true });
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
    wrapper.setProps({
      mouseActivationMethod: MOUSE_ACTIVATION.MOUSE_DOWN
    });
    wrapper.setState({ active: true });
    dispatchMouseEvent(parentNode, "mouseup");
    expect(wrapper.state().active).toBe(false);
  });
});

describe("touch activation", () => {
  let wrapper;
  let parentNode;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    wrapper = mount(
      <ReactInputPosition
        className="test-class"
        minUpdateSpeedInMs={0}
        tapDurationInMs={100}
        doubleTapDurationInMs={200}
        longTouchDurationInMs={400}
      >
        <TestComponent />
        <div className="test-div" />
      </ReactInputPosition>
    );

    parentNode = wrapper.getDOMNode();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("activates by tap", () => {
    dispatchTapEvent(parentNode);
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by tap", () => {
    wrapper.setState({ active: true });
    dispatchTapEvent(parentNode);
    expect(wrapper.state().active).toBe(false);
  });

  it("doesn't activate if tapTimer has expired", () => {
    dispatchTouchEvent(parentNode, "touchstart");
    jest.advanceTimersByTime(101);
    dispatchTouchEvent(parentNode, "touchend");
    expect(wrapper.state().active).toBe(false);
  });

  it("activates by double tap", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.DOUBLE_TAP
    });
    dispatchTapEvent(parentNode);
    dispatchTapEvent(parentNode);
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by double tap", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.DOUBLE_TAP
    });
    wrapper.setState({ active: true });
    dispatchTapEvent(parentNode);
    dispatchTapEvent(parentNode);
    expect(wrapper.state().active).toBe(false);
  });

  it("doesn't activate by double tap if doubleTapTimer has expired", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.DOUBLE_TAP
    });
    dispatchTapEvent(parentNode);
    jest.advanceTimersByTime(201);
    dispatchTapEvent(parentNode);
    expect(wrapper.state().active).toBe(false);
  });

  it("activates by touch", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.TOUCH
    });
    dispatchTouchEvent(parentNode, "touchstart");
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by touch end", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.TOUCH
    });
    wrapper.setState({ active: true });
    dispatchTouchEvent(parentNode, "touchend");
    expect(wrapper.state().active).toBe(false);
  });

  it("activate by long touch", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.LONG_TOUCH
    });
    dispatchTouchEvent(parentNode, "touchstart");
    jest.advanceTimersByTime(401);
    dispatchTouchEvent(parentNode, "touchend");
    expect(wrapper.state().active).toBe(true);
  });

  it("deactivates by long touch", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.LONG_TOUCH
    });
    wrapper.setState({ active: true });
    dispatchTouchEvent(parentNode, "touchstart");
    jest.advanceTimersByTime(401);
    dispatchTouchEvent(parentNode, "touchend");
    expect(wrapper.state().active).toBe(false);
  });

  it("doesn't activate by long touch if longTouchTimer hasn't expired", () => {
    wrapper.setProps({
      touchActivationMethod: TOUCH_ACTIVATION.LONG_TOUCH
    });
    dispatchTouchEvent(parentNode, "touchstart");
    jest.advanceTimersByTime(399);
    dispatchTouchEvent(parentNode, "touchend");
    expect(wrapper.state().active).toBe(false);
  });
});

describe("item tracking", () => {
  let getBoundingClientRectSpy;
  let wrapper;
  let parentNode;

  beforeAll(() => {
    getBoundingClientRectSpy = jest
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(function() {
        return {
          left: 0,
          top: 0,
          width: Number(this.style.width.slice(0, -2)),
          height: Number(this.style.height.slice(0, -2))
        };
      });
    jest.useFakeTimers();
  });

  afterAll(() => {
    getBoundingClientRectSpy.mockRestore();
    jest.useRealTimers();
  });

  beforeEach(() => {
    wrapper = mount(
      <ReactInputPosition
        minUpdateSpeedInMs={0}
        style={{ width: "400px", height: "400px", position: "relative" }}
        trackItemPosition
      >
        <TestComponent />
      </ReactInputPosition>
    );
    parentNode = wrapper.getDOMNode();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("doesn't update position until refresh timer has expired", () => {
    const instance = wrapper.instance();
    wrapper.setProps({ minUpdateSpeedInMs: 100 });
    instance.refresh = true;
    instance.onLoadRefresh();

    jest.advanceTimersByTime(150);

    dispatchClickEvent(parentNode);
    wrapper.update();

    expect(wrapper.state().active).toBe(true);

    dispatchMouseEvent(parentNode, "mousemove", { x: 25, y: 37 });
    wrapper.update();

    expect(wrapper.state().activePosition).toEqual({ x: 10, y: 10 });
  });

  it("tracks passive position", () => {
    wrapper.setProps({ trackPassivePosition: true });
    dispatchMouseEvent(parentNode, "mousemove", { x: 25, y: 37 });
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.passivePosition).toEqual({ x: 25, y: 37 });
  });

  it("tracks active position", () => {
    dispatchClickEvent(parentNode);
    wrapper.update();
    dispatchMouseEvent(parentNode, "mousemove", { x: 25, y: 37 });
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.activePosition).toEqual({ x: 25, y: 37 });
  });

  it("centers item position on activate", () => {
    wrapper.setProps({
      centerItemOnActivate: true,
      itemPositionLimitBySize: true
    });
    dispatchClickEvent(parentNode);
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.itemPosition).toEqual({ x: -50, y: -50 });
  });

  it("centers item position on activate position", () => {
    wrapper.setProps({
      centerItemOnActivatePos: true
    });
    dispatchMouseEvent(parentNode, "mousedown", { x: 0, y: 0 });
    dispatchMouseEvent(parentNode, "mouseup", { x: 0, y: 0 });
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.itemPosition).toEqual({ x: 200, y: 200 });
  });

  it("align item position on active position", () => {
    wrapper.setProps({
      alignItemOnActivePos: true
    });
    dispatchClickEvent(parentNode);
    wrapper.update();
    dispatchMouseEvent(parentNode, "mousemove", { x: 400, y: 400 });
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.itemPosition).toEqual({ x: -100, y: -100 });
  });

  it("links item to active position", () => {
    wrapper.setProps({
      linkItemToActive: true
    });
    dispatchClickEvent(parentNode);
    wrapper.update();
    const childProps = wrapper.find(TestComponent).props();
    expect(childProps.itemPosition).toEqual({ x: 10, y: 10 });
  });
});

describe("onUpdate callback", () => {
  const updateCallback = jest.fn();

  it("calls onUpdate callback with current state", () => {
    const wrapper = mount(
      <ReactInputPosition minUpdateSpeedInMs={0} onUpdate={updateCallback}>
        <TestComponent />
      </ReactInputPosition>
    );

    expect(updateCallback).toHaveBeenCalledTimes(1);
    expect(updateCallback).toHaveBeenCalledWith(wrapper.state());

    wrapper.unmount();
    updateCallback.mockClear();
  });

  it("calls onUpdate callback with proposed state changes when state is overridden", () => {
    const wrapper = mount(
      <ReactInputPosition
        minUpdateSpeedInMs={0}
        onUpdate={updateCallback}
        overrideState={defaultState}
      >
        <TestComponent />
      </ReactInputPosition>
    );

    updateCallback.mockClear();

    dispatchClickEvent(wrapper.getDOMNode());
    wrapper.update();

    expect(updateCallback).toHaveBeenCalledTimes(1);
    expect(updateCallback).toHaveBeenCalledWith({
      active: true,
      activePosition: { x: 0, y: 0 },
      elementDimensions: { height: 0, width: 0 },
      elementOffset: { left: 0, top: 0 },
      itemDimensions: { height: 0, width: 0 }
    });

    wrapper.unmount();
    updateCallback.mockClear();
  });
});

describe("overrideState", () => {
  const testDefaultState = {
    active: true,
    activePosition: { x: 100, y: 200 },
    prevActivePosition: { x: 0, y: 0 },
    passivePosition: { x: 0, y: 0 },
    elementDimensions: { width: 0, height: 0 },
    elementOffset: { left: 0, top: 0 },
    itemPosition: { x: 0, y: 0 },
    itemDimensions: { width: 0, height: 0 }
  };

  it("uses overrideState instead of internal state", () => {
    const wrapper = mount(
      <ReactInputPosition
        minUpdateSpeedInMs={0}
        overrideState={testDefaultState}
      >
        <TestComponent />
      </ReactInputPosition>
    );

    const childWrapper = wrapper.find(TestComponent);
    expect(childWrapper.props()).toMatchObject(testDefaultState);

    wrapper.unmount();
  });
});
