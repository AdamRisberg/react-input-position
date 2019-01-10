import utils from "../utils";

function mouseDown() {
  this.mouseDown = true;
  this.mouseJustDown = true;
};

function mouseUp() {
  this.mouseDown = false;
  this.mouseJustDown = false;
}

function dblClick(e) {
  const position = { x: e.clientX, y: e.clientY };

  this.toggleActive(position);
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if(!this.state.active) {
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
  dblClick,
  mouseMove,
  mouseLeave,
  dragStart: utils.preventDefault
};