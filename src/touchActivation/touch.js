function touchStart(e) {
  this.touched = true;
  this.justTouched = true;

  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.activate(position);
}

function touchEnd(e) {
  if (e.cancelable) e.preventDefault();

  this.touched = false;
  this.justTouched = false;

  this.deactivate();
}

function touchMove(e) {
  if (!this.state.active) return;
  if (e.cancelable) e.preventDefault();

  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.setPosition(position, this.touched && !this.justTouched);
  this.justTouched = false;
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
