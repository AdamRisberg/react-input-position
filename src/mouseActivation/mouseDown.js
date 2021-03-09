import utils from "../utils";

function mouseDown(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.activate(position);
}

function mouseUp() {
  this.deactivate();

  if (this.mouseOutside) {
    addRemoveOutsideHandlers.call(this);
  }
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if (!this.getState().active) {
    return this.setPassivePosition(position);
  }

  this.setPosition(position, true);
}

function mouseEnter() {
  if (this.mouseOutside) {
    this.mouseOutside = false;
    addRemoveOutsideHandlers.call(this);
  }
}

function mouseLeave() {
  if (!this.getState().active) {
    return;
  }

  if (!this.props.mouseDownAllowOutside) {
    return this.deactivate();
  }

  this.mouseOutside = true;
  addRemoveOutsideHandlers.call(this, true);
}

function addRemoveOutsideHandlers(add) {
  this.mouseHandlers
    .filter(h => h.event === "mouseup" || h.event === "mousemove")
    .forEach(({ event, handler }) => {
      if (add) {
        window.addEventListener(event, handler);
      } else {
        window.removeEventListener(event, handler);
      }
    });
}

function wheel(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.setPosition(position);
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseLeave,
  mouseEnter,
  wheel,
  dragStart: utils.preventDefault
};
