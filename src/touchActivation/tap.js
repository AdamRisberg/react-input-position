function touchStart() {
  this.touched = true;
  this.startTapTimer();
}

function touchEnd(e) {
  if (e.cancelable) e.preventDefault();

  this.touched = false;

  if (this.tapTimedOut) {
    this.tapTimedOut = false;
    return;
  }
  clearTimeout(this.tapTimer);

  const touch = e.changedTouches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.toggleActive(position);

  this.tapTimedOut = false;
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
