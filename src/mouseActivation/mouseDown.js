import utils from "../utils";

function mouseDown(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.activate(position);
}

function mouseUp() {
  this.deactivate();
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if (!this.getState().active) {
    return this.setPassivePosition(position);
  }

  this.setPosition(position);
}

function mouseLeave() {
  if (this.getState().active) {
    this.deactivate();
  }
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseLeave,
  dragStart: utils.preventDefault
};
