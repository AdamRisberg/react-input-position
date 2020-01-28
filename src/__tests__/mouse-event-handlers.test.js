import mouseHandlers from "../mouseActivation";

let mockComponent;

beforeEach(() => {
  mockComponent = {
    toggleActive: jest.fn(),
    setPosition: jest.fn(),
    setPassivePosition: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    props: {
      mouseDownAllowOutside: false
    },
    state: {
      active: false
    },
    getState: function() {
      return this.state;
    }
  };
});

describe("mouse - click activation event handlers", () => {
  const { mouseDown, mouseUp, mouseMove, mouseLeave } = mouseHandlers.click;

  it("sets correct properties on mouse down", () => {
    mouseDown.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.mouseDown).toBe(true);
    expect(mockComponent.clickMoveStartRef).toBe(90);
  });

  it("calls toggleActive on mouse up", () => {
    mockComponent.mouseDown = true;
    mockComponent.props = { clickMoveLimit: 20 };
    mockComponent.clickMoveStartRef = 90;
    mouseUp.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.mouseDown).toBe(false);
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
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("sets correct properties on mouse leave", () => {
    mockComponent.mouseDown = true;
    mouseLeave.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(false);
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
  });

  it("sets correct properties on mouse up", () => {
    mouseUp.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(false);
  });

  it("calls toggleActive on double click", () => {
    dblClick.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledWith({ x: 40, y: 50 });
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
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("sets correct properties on mouse leave", () => {
    mockComponent.mouseDown = true;
    mouseLeave.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(false);
  });
});

describe("mouse - hover activation event handlers", () => {
  const {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseEnter,
    mouseLeave
  } = mouseHandlers.hover;

  it("sets correct properties on mouse down", () => {
    mouseDown.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(true);
  });

  it("sets correct properties on mouse up", () => {
    mouseUp.call(mockComponent);

    expect(mockComponent.mouseDown).toBe(false);
  });

  it("calls active on mouse move when inactive", () => {
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.activate).toHaveBeenCalledTimes(1);
    expect(mockComponent.activate).toHaveBeenCalledWith({
      x: 40,
      y: 50
    });
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("calls setPosition on mouse move when active", () => {
    mockComponent.state.active = true;
    mockComponent.mouseDown = true;
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("calls activate on mouse enter", () => {
    mouseEnter.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.activate).toHaveBeenCalledTimes(1);
    expect(mockComponent.activate).toHaveBeenCalledWith({ x: 40, y: 50 });
  });

  it("calls deactive and sets correct properties on mouse leave", () => {
    mockComponent.mouseDown = true;
    mouseLeave.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
    expect(mockComponent.mouseDown).toBe(false);
  });
});

describe("mouse - mouse down activation event handlers", () => {
  const { mouseDown, mouseUp, mouseMove, mouseLeave } = mouseHandlers.mouseDown;

  it("calls activate on mouse down", () => {
    mouseDown.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.activate).toHaveBeenCalledTimes(1);
    expect(mockComponent.activate).toHaveBeenCalledWith({ x: 40, y: 50 });
  });

  it("calls deactivate on mouse up", () => {
    mouseUp.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
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
    mouseMove.call(mockComponent, { clientX: 40, clientY: 50 });

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("calls deactivate on mouse leave when active", () => {
    mockComponent.state.active = true;
    mouseLeave.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });

  it("does nothing on mouse leave when inactive", () => {
    mouseLeave.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(0);
  });
});
