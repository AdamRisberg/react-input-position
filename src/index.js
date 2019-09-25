import React, { Component } from "react";
import PropTypes from "prop-types";
import mouseActivation from "./mouseActivation";
import touchActivation from "./touchActivation";
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from "./constants";
import utils from "./utils";

class ReactInputPosition extends Component {
  state = {
    active: false,
    activePosition: { x: 0, y: 0 },
    prevActivePosition: { x: 0, y: 0 },
    passivePosition: { x: 0, y: 0 },
    elementDimensions: { width: 0, height: 0 },
    elementOffset: { left: 0, top: 0 },
    itemPosition: { x: 0, y: 0 },
    itemDimensions: { width: 0, height: 0 }
  };

  containerRef = React.createRef();
  itemRef = React.createRef();
  mouseDown = false;
  touched = false;
  justTouched = false;
  tapped = false;
  tapTimer = null;
  tapTimedOut = false;
  doubleTapTimer = null;
  doubleTapTimedOut = false;
  longTouchTimer = null;
  longTouchTimedOut = false;
  refresh = true;

  static propTypes = {
    mouseActivationMethod: PropTypes.oneOf([
      MOUSE_ACTIVATION.CLICK,
      MOUSE_ACTIVATION.DOUBLE_CLICK,
      MOUSE_ACTIVATION.HOVER,
      MOUSE_ACTIVATION.MOUSE_DOWN
    ]).isRequired,
    touchActivationMethod: PropTypes.oneOf([
      TOUCH_ACTIVATION.DOUBLE_TAP,
      TOUCH_ACTIVATION.LONG_TOUCH,
      TOUCH_ACTIVATION.TAP,
      TOUCH_ACTIVATION.TOUCH
    ]).isRequired,
    tapDurationInMs: PropTypes.number,
    doubleTapDurationInMs: PropTypes.number,
    longTouchDurationInMs: PropTypes.number,
    longTouchMoveLimit: PropTypes.number,
    clickMoveLimit: PropTypes.number,
    itemPositionMinX: PropTypes.number,
    itemPositionMaxX: PropTypes.number,
    itemPositionMinY: PropTypes.number,
    itemPositionMaxY: PropTypes.number,
    itemPositionLimitBySize: PropTypes.bool,
    itemPositionLimitInternal: PropTypes.bool,
    linkItemToActive: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    minUpdateSpeedInMs: PropTypes.number,
    trackPassivePosition: PropTypes.bool,
    trackItemPosition: PropTypes.bool,
    trackPreviousPosition: PropTypes.bool,
    centerItemOnActivate: PropTypes.bool,
    centerItemOnActivatePos: PropTypes.bool,
    centerItemOnLoad: PropTypes.bool,
    alignItemOnActivePos: PropTypes.bool,
    itemMovementMultiplier: PropTypes.number,
    cursorStyle: PropTypes.string,
    cursorStyleActive: PropTypes.string,
    onUpdate: PropTypes.func
  };

  static defaultProps = {
    tapDurationInMs: 180,
    doubleTapDurationInMs: 400,
    longTouchDurationInMs: 500,
    longTouchMoveLimit: 5,
    clickMoveLimit: 5,
    style: {},
    minUpdateSpeedInMs: 1,
    itemMovementMultiplier: 1,
    cursorStyle: "crosshair",
    mouseActivationMethod: MOUSE_ACTIVATION.CLICK,
    touchActivationMethod: TOUCH_ACTIVATION.TAP
  };

  componentDidMount() {
    this.init();
    this.refreshPosition();
  }

  componentWillUnmount() {
    this.removeMouseEventListeners();
    this.removeTouchEventListeners();
    this.removeOtherEventListeners();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mouseActivationMethod !== this.props.mouseActivationMethod) {
      this.removeMouseEventListeners();
      this.setMouseInteractionMethods();
      this.addMouseEventListeners();
    }
    if (prevProps.touchActivationMethod !== this.props.touchActivationMethod) {
      this.removeTouchEventListeners();
      this.setTouchInteractionMethods();
      this.addTouchEventListeners();
    }
  }

  init() {
    this.checkPassiveEventSupport();
    this.setInputInteractionMethods();
    this.addMouseEventListeners();
    this.addTouchEventListeners();
    this.addOtherEventListeners();
  }

  checkPassiveEventSupport() {
    this.supportsPassive = false;
    try {
      const options = Object.defineProperty({}, "passive", {
        get: () => (this.supportsPassive = true)
      });
      window.addEventListener("testPassive", null, options);
      window.removeEventListener("testPassive", null, options);
    } catch (e) {}
  }

  updateState(changes, cb) {
    const { onUpdate } = this.props;

    this.setState(
      () => changes,
      () => {
        cb && cb.call(this);
        onUpdate && onUpdate(this.state);
      }
    );
  }

  onLoadRefresh = () => {
    this.refreshPosition();
  };

  refreshPosition() {
    const { trackItemPosition, centerItemOnLoad } = this.props;

    this.setPosition(
      { x: 0, y: 0 },
      trackItemPosition,
      false,
      centerItemOnLoad
    );
  }

  setInputInteractionMethods() {
    this.setMouseInteractionMethods();
    this.setTouchInteractionMethods();
  }

  setMouseInteractionMethods() {
    const mouseInteractionMethods =
      mouseActivation[this.props.mouseActivationMethod];
    this.mouseHandlers = [];

    for (let key in mouseInteractionMethods) {
      this.mouseHandlers.push({
        event: key.toLowerCase(),
        handler: mouseInteractionMethods[key].bind(this)
      });
    }
  }

  setTouchInteractionMethods() {
    const touchInteractionMethods =
      touchActivation[this.props.touchActivationMethod];
    this.touchHandlers = [];

    for (let key in touchInteractionMethods) {
      this.touchHandlers.push({
        event: key.toLowerCase(),
        handler: touchInteractionMethods[key].bind(this)
      });
    }
  }

  handleResize = () => {
    this.refreshPosition();
  };

  setPosition(position, updateItemPosition, activate, centerItem) {
    if (this.props.minUpdateSpeedInMs && !this.refresh) return;
    this.refresh = false;

    const {
      left,
      top,
      width,
      height
    } = this.containerRef.current.getBoundingClientRect();

    const {
      trackItemPosition,
      trackPassivePosition,
      trackPreviousPosition,
      centerItemOnActivate,
      centerItemOnActivatePos,
      linkItemToActive,
      itemMovementMultiplier,
      alignItemOnActivePos,
      itemPositionMinX,
      itemPositionMaxX,
      itemPositionMinY,
      itemPositionMaxY,
      itemPositionLimitBySize,
      itemPositionLimitInternal
    } = this.props;

    // Set container div info and active position
    const stateUpdate = {
      elementDimensions: { width, height },
      elementOffset: { left, top },
      activePosition: {
        x: Math.min(Math.max(0, position.x - left), width),
        y: Math.min(Math.max(0, position.y - top), height)
      }
    };

    // Activate if necessary
    if (activate) stateUpdate.active = true;

    // Set item dimensions
    if (this.itemRef.current) {
      const itemSize = this.itemRef.current.getBoundingClientRect();

      stateUpdate.itemDimensions = {
        width: itemSize.width,
        height: itemSize.height
      };
    }

    // Set previous active position
    if (trackPreviousPosition || trackItemPosition) {
      stateUpdate.prevActivePosition = {
        x: this.state.activePosition.x,
        y: this.state.activePosition.y
      };
    }

    // Set passive position
    if (trackPassivePosition) {
      stateUpdate.passivePosition = {
        x: position.x - left,
        y: position.y - top
      };
    }

    // Create adjusted limits
    const limits = utils.createAdjustedLimits(
      itemPositionMinX,
      itemPositionMaxX,
      itemPositionMinY,
      itemPositionMaxY,
      stateUpdate.elementDimensions,
      stateUpdate.itemDimensions,
      itemPositionLimitBySize,
      itemPositionLimitInternal
    );

    // Center item
    if (centerItem || (activate && centerItemOnActivate)) {
      const centerX = (limits.maxX + limits.minX) / 2;
      const centerY = (limits.maxY + limits.minY) / 2;

      stateUpdate.itemPosition = {
        x: centerX || 0,
        y: centerY || 0
      };

      return this.updateState(stateUpdate, this.startRefreshTimer);
    }

    let shouldLimitItem = true;

    // Set item position
    if (trackItemPosition && linkItemToActive) {
      stateUpdate.itemPosition = { ...stateUpdate.activePosition };
    } else if (trackItemPosition && alignItemOnActivePos) {
      stateUpdate.itemPosition = utils.alignItemOnPosition(
        stateUpdate.elementDimensions,
        stateUpdate.itemDimensions,
        stateUpdate.activePosition
      );
    } else if (trackItemPosition && activate && centerItemOnActivatePos) {
      stateUpdate.itemPosition = utils.centerItemOnPosition(
        stateUpdate.elementDimensions,
        stateUpdate.itemDimensions,
        stateUpdate.activePosition
      );
    } else if (trackItemPosition && updateItemPosition) {
      stateUpdate.itemPosition = utils.calculateItemPosition(
        this.state.itemPosition,
        stateUpdate.prevActivePosition,
        stateUpdate.activePosition,
        itemMovementMultiplier
      );
    } else {
      shouldLimitItem = false;
    }

    // Apply position limits
    if (shouldLimitItem) {
      stateUpdate.itemPosition = utils.limitPosition(
        limits.minX,
        limits.maxX,
        limits.minY,
        limits.maxY,
        stateUpdate.itemPosition
      );
    }

    this.updateState(stateUpdate, this.startRefreshTimer);
  }

  setPassivePosition(position) {
    if (!this.props.trackPassivePosition) return;

    const { left, top } = this.containerRef.current.getBoundingClientRect();

    this.updateState({
      passivePosition: {
        x: position.x - left,
        y: position.y - top
      }
    });
  }

  toggleActive(position = { x: 0, y: 0 }) {
    if (!this.state.active) {
      this.activate(position);
    } else {
      this.deactivate();
    }
  }

  activate(position = { x: 0, y: 0 }) {
    this.setPosition(position, false, true);
  }

  deactivate() {
    this.updateState({ active: false });
  }

  startRefreshTimer() {
    if (!this.props.minUpdateSpeedInMs) return;

    setTimeout(() => {
      this.refresh = true;
    }, this.props.minUpdateSpeedInMs);
  }

  startTapTimer() {
    this.tapTimer = setTimeout(() => {
      this.tapTimedOut = true;
    }, this.props.tapDurationInMs);
  }

  startDoubleTapTimer() {
    this.doubleTapTimer = setTimeout(() => {
      this.doubleTapTimedOut = true;
    }, this.props.doubleTapDurationInMs);
  }

  startLongTouchTimer(e) {
    this.longTouchTimer = setTimeout(() => {
      if (this.touched) {
        this.toggleActive(e);
      }
    }, this.props.longTouchDurationInMs);
  }

  addMouseEventListeners() {
    this.mouseHandlers.forEach(mouse => {
      this.containerRef.current.addEventListener(mouse.event, mouse.handler);
    });
  }

  addTouchEventListeners() {
    this.touchHandlers.forEach(touch => {
      this.containerRef.current.addEventListener(
        touch.event,
        touch.handler,
        this.supportsPassive ? { passive: false } : false
      );
    });
  }

  removeMouseEventListeners() {
    this.mouseHandlers.forEach(mouse => {
      this.containerRef.current.removeEventListener(mouse.event, mouse.handler);
    });
  }

  removeTouchEventListeners() {
    this.touchHandlers.forEach(touch => {
      this.containerRef.current.removeEventListener(
        touch.event,
        touch.handler,
        this.supportsPassive ? { passive: false } : false
      );
    });
  }

  addOtherEventListeners() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("load", this.onLoadRefresh);
  }

  removeOtherEventListeners() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("load", this.onLoadRefresh);
  }

  render() {
    const {
      style,
      className,
      children,
      cursorStyle,
      cursorStyleActive
    } = this.props;
    const { active } = this.state;

    const combinedStyle = {
      ...style,
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
      cursor: active ? cursorStyleActive || cursorStyle : cursorStyle
    };

    return (
      <div style={combinedStyle} className={className} ref={this.containerRef}>
        {utils.decorateChildren(children, {
          ...this.state,
          itemRef: this.itemRef,
          onLoadRefresh: this.onLoadRefresh
        })}
      </div>
    );
  }
}

export { MOUSE_ACTIVATION, TOUCH_ACTIVATION };
export default ReactInputPosition;
