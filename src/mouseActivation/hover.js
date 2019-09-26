import utils from "../utils";

function mouseDown() {
  this.mouseDown = true;
}

function mouseUp() {
  this.mouseDown = false;
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if (!this.getState().active) {
    return this.activate(position);
  }

  this.setPosition(position, this.mouseDown);
}

function mouseEnter(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.activate(position);
}

function mouseLeave() {
  this.deactivate();
  this.mouseDown = false;
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseEnter,
  mouseLeave,
  dragStart: utils.preventDefault
};
