import utils from "../utils";

function mouseDown(e) {
  this.mouseDown = true;
  this.mouseJustDown = false;

  this.clickMoveStartRef = e.clientX + e.clientY;
}

function mouseUp(e) {
  if (!this.mouseDown) return;

  this.mouseDown = false;
  this.mouseJustDown = false;

  const position = { x: e.clientX, y: e.clientY };

  const clickMoveEnd = position.x + position.y;
  const diff = Math.abs(this.clickMoveStartRef - clickMoveEnd);

  if (diff < this.props.clickMoveLimit) {
    this.toggleActive(position);
  }
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if (!this.state.active) {
    return this.setPassivePosition(position);
  }

  this.setPosition(position, this.mouseDown && !this.mouseJustDown);

  this.mouseJustDown = false;
}

function mouseLeave() {
  this.mouseDown = false;
  this.mouseJustDown = false;
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseLeave,
  dragStart: utils.preventDefault
};
