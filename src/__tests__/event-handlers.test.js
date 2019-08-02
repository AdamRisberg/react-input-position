import mouseHandlers from "../mouseActivation";
import touchHandlers from "../touchActivation";

let mockComponent;

beforeEach(() => {
  mockComponent = {
    toggleActive: jest.fn(),
    setPosition: jest.fn(),
    setPassivePosition: jest.fn(),
    state: {
      active: false
    }
  };
});

describe("mouse - click activation event handlers", () => {
  const { mouseDown, mouseUp, mouseMove, mouseLeave } = mouseHandlers.click;

  it("sets correct properties on mouse down", () => {
    mouseDown.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.mouseDown).toBe(true);
    expect(mockComponent.mouseJustDown).toBe(false);
    expect(mockComponent.clickMoveStartRef).toBe(90);
  });

  it("calls toggleActive on mouse up", () => {
    mockComponent.mouseDown = true;
    mockComponent.props = { clickMoveLimit: 20 };
    mockComponent.clickMoveStartRef = 90;
    mouseUp.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.mouseDown).toBe(false);
    expect(mockComponent.mouseJustDown).toBe(false);
    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledWith({ x: 40, y: 50 });
  });

  it("doesn't call toggleActive on mouse up when exceeding clickMoveLimit", () => {
    mockComponent.mouseDown = true;
    mockComponent.props = { clickMoveLimit: 20 };
    mockComponent.clickMoveStartRef = 90;
    mouseUp.call(mockComponent, { clientX: 40, clientY: 25 });

    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(0);
  });

  it("does nothing on mouse up with no preceeding mouse down event", () => {
    mouseUp.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.mouseDown).toBe(undefined);
    expect(mockComponent.mouseJustDown).toBe(undefined);
    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(0);
  });

  it("calls setPassivePosition on mouse move when inactive", () => {
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPassivePosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPassivePosition).toHaveBeenCalledWith({
      x: 40,
      y: 50
    });
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("calls setPosition on mouse move when active", () => {
    mockComponent.state.active = true;
    mockComponent.mouseDown = true;
    mockComponent.mouseJustDown = true;
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      false
    );
    expect(mockComponent.mouseJustDown).toBe(false);
  });

  it("sets correct properties on mouse leave", () => {
    mockComponent.mouseDown = true;
    mockComponent.mouseJustDown = true;
    mouseLeave.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(false);
    expect(mockComponent.mouseJustDown).toBe(false);
  });
});

describe("mouse - double click activation event handlers", () => {
  const {
    mouseDown,
    mouseUp,
    dblClick,
    mouseMove,
    mouseLeave
  } = mouseHandlers.doubleClick;

  it("sets correct properties on mouse down", () => {
    mouseDown.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(true);
    expect(mockComponent.mouseJustDown).toBe(true);
  });
});
