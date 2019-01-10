import utils from "../utils";

function mouseDown(e) {
  this.mouseJustDown = true;
  const position = { x: e.clientX, y: e.clientY };
  this.activate(position);
};

function mouseUp() {
  this.mouseJustDown = false;
  this.deactivate();
}

function mouseMove(e) {
  const position = { x: e.clientX, y: e.clientY };

  if(!this.state.active) {
    return this.setPassivePosition(position);
  } 

  this.setPosition(position, !this.mouseJustDown);
  this.mouseJustDown = false;
}

function mouseLeave() {
  if(this.state.active) {
    this.deactivate();
  }
  this.mouseJustDown = false;
}

export default {
  mouseDown,
  mouseUp,
  mouseMove,
  mouseLeave,
  dragStart: utils.preventDefault
};