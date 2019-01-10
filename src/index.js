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
    itemDimensions: { width: 0, height: 0 },
    refreshToggle: false
  };

  containerRef = React.createRef();
  itemRef = React.createRef();
  mouseDown = false;
  mouseJustDown = false;
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
    itemMovementMultiplier: PropTypes.number,
    cursorStyle: PropTypes.string,
    cursorStyleActive: PropTypes.string
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
    if(prevProps.mouseActivationMethod !== this.props.mouseActivationMethod) {
      this.removeMouseEventListeners();
      this.setMouseInteractionMethods();
      this.addMouseEventListeners();
    }
    if(prevProps.touchActivationMethod !== this.props.touchActivationMethod) {
      this.removeTouchEventListeners();
      this.setTouchInteractionMethods();
      this.addTouchEventListeners();
    }
  }

  init() {
    this.setInputInteractionMethods();
    this.addMouseEventListeners();
    this.addTouchEventListeners();
    this.addOtherEventListeners();
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
    const mouseInteractionMethods = mouseActivation[this.props.mouseActivationMethod];
    this.mouseHandlers = [];

    for(let key in mouseInteractionMethods) {
      this.mouseHandlers.push({
        event: key.toLowerCase(),
        handler: mouseInteractionMethods[key].bind(this)
      });
    }
  }

  setTouchInteractionMethods() {
    const touchInteractionMethods = touchActivation[this.props.touchActivationMethod];
    this.touchHandlers = [];

    for(let key in touchInteractionMethods) {
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
      itemMovementMultiplier
    } = this.props;

    const stateUpdate = {
      elementDimensions: { width, height },
      elementOffset: { left, top },
      activePosition: {
        x: Math.min(Math.max(0, position.x - left), width),
        y: Math.min(Math.max(0, position.y - top), height)
      }
    };

    if (this.itemRef.current) {
      const itemSize = this.itemRef.current.getBoundingClientRect();

      stateUpdate.itemDimensions = {
        width: itemSize.width,
        height: itemSize.height
      };
    }

    if (trackPreviousPosition || trackItemPosition) {
      stateUpdate.prevActivePosition = {
        x: this.state.activePosition.x,
        y: this.state.activePosition.y
      };
    }

    if (trackPassivePosition) {
      stateUpdate.passivePosition = {
        x: position.x - left,
        y: position.y - top
      };
    }

    let shouldLimitItem = false;

    if (trackItemPosition && linkItemToActive) {
      stateUpdate.itemPosition = { ...stateUpdate.activePosition };
      shouldLimitItem = true;
    } else if (trackItemPosition && updateItemPosition) {
      stateUpdate.itemPosition = { ...this.state.itemPosition };

      const moveX =
        (stateUpdate.activePosition.x - stateUpdate.prevActivePosition.x) *
        itemMovementMultiplier;
      const moveY =
        (stateUpdate.activePosition.y - stateUpdate.prevActivePosition.y) *
        itemMovementMultiplier;

      stateUpdate.itemPosition.x += moveX;
      stateUpdate.itemPosition.y += moveY;
      shouldLimitItem = true;
    } else if (trackItemPosition && activate && centerItemOnActivate) {
      shouldLimitItem = true;
    } else if (trackItemPosition && activate && centerItemOnActivatePos) {
      stateUpdate.itemPosition = {
        x: convertRange(
          0,
          width,
          0,
          -(stateUpdate.itemDimensions.width || 0) + width,
          stateUpdate.activePosition.x
        ) + ((width / 2) - stateUpdate.activePosition.x),
        y: convertRange(
          0,
          height,
          0,
          -(stateUpdate.itemDimensions.height || 0) + height,
          stateUpdate.activePosition.y
        ) + ((height / 2) - stateUpdate.activePosition.y)
      };
      shouldLimitItem = true;
    }

    if (shouldLimitItem || centerItem) {
      stateUpdate.itemPosition = this.limitItemPosition(
        stateUpdate.itemPosition,
        (activate && centerItemOnActivate) || centerItem,
        stateUpdate.elementDimensions.width,
        stateUpdate.elementDimensions.height,
        stateUpdate.itemDimensions && stateUpdate.itemDimensions.width,
        stateUpdate.itemDimensions && stateUpdate.itemDimensions.height
      );
    }

    if (activate) stateUpdate.active = true;

    this.setState(() => stateUpdate, this.startRefreshTimer);
  }

  setPassivePosition(position) {
    if (!this.props.trackPassivePosition) return;

    const { left, top } = this.containerRef.current.getBoundingClientRect();

    this.setState(() => ({
      passivePosition: {
        x: position.x - left,
        y: position.y - top
      }
    }));
  }

  limitItemPosition(
    itemPosition,
    center,
    elemWidth,
    elemHeight,
    itemWidth,
    itemHeight
  ) {
    let {
      itemPositionMinX,
      itemPositionMaxX,
      itemPositionMinY,
      itemPositionMaxY,
      itemPositionLimitBySize,
      itemPositionLimitInternal
    } = this.props;

    if (itemPositionMaxX < 0) {
      itemPositionMaxX = elemWidth + itemPositionMaxX;
    }

    if (itemPositionMaxY < 0) {
      itemPositionMaxY = elemHeight + itemPositionMaxY;
    }

    if (itemPositionLimitBySize) {
      let offsetX = this.state.elementDimensions.width;
      let offsetY = this.state.elementDimensions.height;

      if (itemPositionLimitInternal) {
        itemPositionMinX = 0;
        itemPositionMinY = 0;
        itemPositionMaxX = offsetX - itemWidth;
        itemPositionMaxY = offsetY - itemHeight;

        if (itemWidth > offsetX || itemHeight > offsetY) {
          itemPositionMaxX = 0;
          itemPositionMaxY = 0;
        }
      } else if (itemWidth || itemHeight) {

        itemPositionMaxX = 0;
        itemPositionMaxY = 0;
        itemPositionMinX = -itemWidth + offsetX;
        itemPositionMinY = -itemHeight + offsetY;

        if (itemWidth < offsetX || itemHeight < offsetY) {
          itemPositionMinX = 0;
          itemPositionMinY = 0;
        }
      }
    }

    const position = { ...itemPosition };

    if (center) {
      const centerX = (itemPositionMaxX + itemPositionMinX) / 2;
      const centerY = (itemPositionMaxY + itemPositionMinY) / 2;
      position.x = centerX || 0;
      position.y = centerY || 0;
    }

    if (itemPositionMinX !== undefined && position.x < itemPositionMinX) {
      position.x = itemPositionMinX;
    } else if (
      itemPositionMaxX !== undefined &&
      position.x > itemPositionMaxX
    ) {
      position.x = itemPositionMaxX;
    }
    if (itemPositionMinY !== undefined && position.y < itemPositionMinY) {
      position.y = itemPositionMinY;
    } else if (
      itemPositionMaxY !== undefined &&
      position.y > itemPositionMaxY
    ) {
      position.y = itemPositionMaxY;
    }

    return position;
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
    this.setState(() => ({ active: false }));
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
      this.containerRef.current.addEventListener(touch.event, touch.handler);
    });
  }

  removeMouseEventListeners() {
    this.mouseHandlers.forEach(mouse => {
      this.containerRef.current.removeEventListener(mouse.event, mouse.handler);
    });
  }

  removeTouchEventListeners() {
    this.touchHandlers.forEach(touch => {
      this.containerRef.current.removeEventListener(touch.event, touch.handler);
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

function convertRange(oldMin, oldMax, newMin, newMax, oldValue) {
  const percent = (oldValue - oldMin) / (oldMax - oldMin);
  return percent * (newMax - newMin) + newMin;
}

export { MOUSE_ACTIVATION, TOUCH_ACTIVATION };
export default ReactInputPosition;
