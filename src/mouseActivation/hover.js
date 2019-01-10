import utils from "../utils";

function mouseDown() {
  this.mouseDown = true;
  this.mouseJustDown = true;
};

function mouseUp() {
  this.mouseDown = false;
  this.mouseJustDown = false;
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if(!this.state.active) {
    return this.activate(position);
  } 

  this.setPosition(position, this.mouseDown && !this.mouseJustDown);
  this.mouseJustDown = false;
}

function mouseEnter(e) {
  const position = { x: e.clientX, y: e.clientY };
  this.activate(position);
}

function mouseLeave() {
  this.deactivate();
  this.mouseDown = false;
  this.mouseJustDown = false;
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseEnter,
  mouseLeave,
  dragStart: utils.preventDefault
};