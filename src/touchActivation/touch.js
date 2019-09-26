function touchStart(e) {
  this.touched = true;

  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.activate(position);
}

function touchEnd(e) {
  if (e.cancelable) e.preventDefault();

  this.touched = false;

  this.deactivate();
}

function touchMove(e) {
  if (!this.getState().active) return;
  if (e.cancelable) e.preventDefault();

  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.setPosition(position, this.touched);
}

function touchCancel() {
  this.deactivate();
}

export default {
  touchStart,
  touchEnd,
  touchMove,
  touchCancel
};
