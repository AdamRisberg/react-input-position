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

  if (this.tapped && !this.doubleTapTimedOut) {
    clearTimeout(this.doubleTapTimer);

    const touch = e.changedTouches[0];
    const position = { x: touch.clientX, y: touch.clientY };
    this.toggleActive(position);

    this.tapped = false;
    return;
  }

  this.tapTimedOut = false;
  this.doubleTapTimedOut = false;
  this.tapped = true;
  this.startDoubleTapTimer();
}

function touchMove(e) {
  if (!this.state.active) return;
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
