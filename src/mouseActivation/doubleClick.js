import utils from "../utils";

function mouseDown() {
  this.mouseDown = true;
}

function mouseUp() {
  this.mouseDown = false;
}

function dblClick(e) {
  const position = { x: e.clientX, y: e.clientY };

  this.toggleActive(position);
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if (!this.getState().active) {
    return this.setPassivePosition(position);
  }

  this.setPosition(position, this.mouseDown);
}

function mouseLeave() {
  this.mouseDown = false;
}

function wheel(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.setPosition(position);
}

export default {
  mouseDown,
  mouseUp,
  dblClick,
  mouseMove,
  mouseLeave,
  wheel,
  dragStart: utils.preventDefault
};
