import touchHandlers from "../touchActivation";

let mockComponent;
let clearTimeoutSpy;
let event;

beforeAll(() => {
  clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
});

beforeEach(() => {
  mockComponent = {
    startTapTimer: jest.fn(),
    startDoubleTapTimer: jest.fn(),
    startLongTouchTimer: jest.fn(),
    toggleActive: jest.fn(),
    setPosition: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    state: {
      active: false
    },
    props: {
      longTouchMoveLimit: 10
    }
  };

  event = {
    touches: [
      {
        clientX: 40,
        clientY: 50
      }
    ],
    changedTouches: [
      {
        clientX: 40,
        clientY: 50
      }
    ],
    preventDefault: jest.fn(),
    cancelable: true
  };
});

afterEach(() => {
  clearTimeoutSpy.mockReset();
});

afterAll(() => {
  clearTimeoutSpy.mockRestore();
});

describe("touch - tap activation event handlers", () => {
  const { touchStart, touchEnd, touchMove, touchCancel } = touchHandlers.tap;

  it("sets correct properties and starts tap timer on touch start", () => {
    touchStart.call(mockComponent);

    expect(mockComponent.touched).toBe(true);
    expect(mockComponent.startTapTimer).toHaveBeenCalledTimes(1);
  });

  it("calls toggleActive on touch end if tapTimer hasn't expired", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    mockComponent.touched = true;
    touchEnd.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledWith({ x: 40, y: 50 });
    expect(mockComponent.touched).toBe(false);
    expect(mockComponent.tapTimedOut).toBe(false);
  });

  it("doesn't call toggleActive on touch end if tapTimer expired", () => {
    mockComponent.tapTimedOut = true;

    touchEnd.call(mockComponent, {});

    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(0);
    expect(mockComponent.tapTimedOut).toBe(false);
  });

  it("does nothing on touch move when inactive", () => {
    touchMove.call(mockComponent);

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("calls setPosition on touch move when active", () => {
    mockComponent.state.active = true;
    mockComponent.touched = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("doesn't call preventDefault on touch move when not cancelable", () => {
    event.cancelable = false;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls deactivate on touch cancel", () => {
    touchCancel.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });
});

describe("touch - double tap activation event handlers", () => {
  const {
    touchStart,
    touchEnd,
    touchMove,
    touchCancel
  } = touchHandlers.doubleTap;

  it("sets correct properties and starts tap timer on touch start", () => {
    touchStart.call(mockComponent);

    expect(mockComponent.touched).toBe(true);
    expect(mockComponent.startTapTimer).toHaveBeenCalledTimes(1);
  });

  it("sets tapped to true on touch end if tapTimer hasn't expired - first tap", () => {
    mockComponent.touched = true;
    mockComponent.tapTimedOut = false;

    touchEnd.call(mockComponent, {});
    expect(mockComponent.tapped).toBe(true);
    expect(mockComponent.touched).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(mockComponent.startDoubleTapTimer).toHaveBeenCalledTimes(1);
  });

  it("sets tapTimedOut to false if tapTimer expired", () => {
    mockComponent.touched = true;
    mockComponent.tapTimedOut = true;

    touchEnd.call(mockComponent, {});

    expect(mockComponent.tapTimedOut).toBe(false);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
  });

  it("calls toggleActive on touch end if doubleTapTimer hasn't expired - second tap", () => {
    mockComponent.touched = true;
    mockComponent.tapped = true;
    mockComponent.doubleTapTimedOut = false;
    touchEnd.call(mockComponent, event);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledWith({ x: 40, y: 50 });
    expect(mockComponent.touched).toBe(false);
    expect(mockComponent.tapped).toBe(false);
  });

  it("it sets correct properties when doubleTapTimer has expired - second tap", () => {
    mockComponent.touched = true;
    mockComponent.tapTimedOut = false;

    touchEnd.call(mockComponent, {});

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(mockComponent.toggleActive).toHaveBeenCalledTimes(0);
    expect(mockComponent.tapTimedOut).toBe(false);
    expect(mockComponent.doubleTapTimedOut).toBe(false);
    expect(mockComponent.tapped).toBe(true);
    expect(mockComponent.startDoubleTapTimer).toHaveBeenCalledTimes(1);
  });

  it("calls setPosition on touch move when active", () => {
    mockComponent.touched = true;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("does nothing on touch move when inactive", () => {
    mockComponent.state.active = false;
    touchMove.call(mockComponent, {});

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("doesn't call preventDefault on touch move when not cancelable", () => {
    event.cancelable = false;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls deactivate on touch cancel", () => {
    touchCancel.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });
});

describe("touch - touch activation event handlers", () => {
  const { touchStart, touchEnd, touchMove, touchCancel } = touchHandlers.touch;

  it("calls activate on touch start", () => {
    touchStart.call(mockComponent, event);

    expect(mockComponent.touched).toBe(true);
    expect(mockComponent.activate).toHaveBeenCalledTimes(1);
    expect(mockComponent.activate).toHaveBeenCalledWith({ x: 40, y: 50 });
  });

  it("calls deactive on touch end", () => {
    touchEnd.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.touched).toBe(false);
    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });

  it("doesn't call preventDefault on touch end when not cancelable", () => {
    event.cancelable = false;
    touchEnd.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls setPosition on touch move when active", () => {
    mockComponent.touched = true;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("does nothing on touch move when inactive", () => {
    touchMove.call(mockComponent, event);

    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("doesn't call preventDefault on touch move when not cancelable", () => {
    event.cancelable = false;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls deactivate on touch cancel", () => {
    touchCancel.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });
});

describe("touch - long touch activation event handlers", () => {
  const {
    touchStart,
    touchEnd,
    touchMove,
    touchCancel
  } = touchHandlers.longTouch;

  it("starts longTouchTimer on touch start", () => {
    touchStart.call(mockComponent, event);

    expect(mockComponent.touched).toBe(true);
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(mockComponent.longTouchStartRef).toBe(90);
    expect(mockComponent.startLongTouchTimer).toHaveBeenCalledTimes(1);
    expect(mockComponent.startLongTouchTimer).toHaveBeenCalledWith({
      x: 40,
      y: 50
    });
  });

  it("sets touched to false on touch end", () => {
    touchEnd.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.touched).toBe(false);
  });

  it("doesn't call preventDefault on touch end when not cancelable", () => {
    event.cancelable = false;
    touchEnd.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls setPosition and clearTimeout on touch move", () => {
    mockComponent.state.active = true;
    mockComponent.touched = true;
    touchMove.call(mockComponent, event);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledWith(
      { x: 40, y: 50 },
      true
    );
  });

  it("calls only clearTimeout on touch move when exceeding move limit and inactive", () => {
    mockComponent.longTouchStartRef = 200;
    mockComponent.state.active = false;
    mockComponent.touched = true;

    touchMove.call(mockComponent, event);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(mockComponent.setPosition).toHaveBeenCalledTimes(0);
  });

  it("doesn't call preventDefault on touch move when not cancelable", () => {
    event.cancelable = false;
    mockComponent.state.active = true;
    touchMove.call(mockComponent, event);

    expect(event.preventDefault).toHaveBeenCalledTimes(0);
  });

  it("calls deactivate on touch cancel", () => {
    touchCancel.call(mockComponent);

    expect(mockComponent.deactivate).toHaveBeenCalledTimes(1);
  });
});
