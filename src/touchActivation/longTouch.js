function touchStart(e) {
  this.touched = true;

  clearTimeout(this.longTouchTimer);

  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  this.longTouchStartRef = position.x + position.y;
  this.startLongTouchTimer(position);
}

function touchEnd(e) {
  if (e.cancelable) e.preventDefault();

  this.touched = false;
}

function touchMove(e) {
  const touch = e.touches[0];
  const position = { x: touch.clientX, y: touch.clientY };
  const end = position.x + position.y;
  const diff = Math.abs(this.longTouchStartRef - end);

  if (diff > this.props.longTouchMoveLimit) {
    clearTimeout(this.longTouchTimer);
  }

  if (!this.state.active) return;
  if (e.cancelable) e.preventDefault();

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
