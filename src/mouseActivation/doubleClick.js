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

  if (!this.state.active) {
    return this.setPassivePosition(position);
  }

  this.setPosition(position, this.mouseDown);
}

function mouseLeave() {
  this.mouseDown = false;
}

export default {
  mouseDown,
  mouseUp,
  dblClick,
  mouseMove,
  mouseLeave,
  dragStart: utils.preventDefault
};
