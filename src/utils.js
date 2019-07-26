import { Children, cloneElement } from "react";

function isReactComponent(element) {
  return typeof element.type === "function";
}

function decorateChild(child, props) {
  return cloneElement(child, props);
}

function shouldDecorateChild(child) {
  return !!child && isReactComponent(child);
}

function decorateChildren(children, props) {
  return Children.map(children, child => {
    return shouldDecorateChild(child) ? decorateChild(child, props) : child;
  });
}

function preventDefault(e) {
  e.preventDefault();
}

function convertRange(oldMin, oldMax, newMin, newMax, oldValue) {
  const percent = (oldValue - oldMin) / (oldMax - oldMin);
  return percent * (newMax - newMin) + newMin;
}

function limitPosition(minX, maxX, minY, maxY, itemPosition) {
  const position = { ...itemPosition };

  if (minX !== undefined && position.x < minX) {
    position.x = minX;
  } else if (maxX !== undefined && position.x > maxX) {
    position.x = maxX;
  }

  if (minY !== undefined && position.y < minY) {
    position.y = minY;
  } else if (maxY !== undefined && position.y > maxY) {
    position.y = maxY;
  }

  return position;
}

function createAdjustedLimits(
  minX,
  maxX,
  minY,
  maxY,
  elemDimensions,
  itemDimensions,
  limitBySize,
  internal
) {
  const limits = { minX, maxX, minY, maxY };

  if (limits.maxX < 0) {
    limits.maxX = elemDimensions.width + limits.maxX;
  }

  if (limits.maxY < 0) {
    limits.maxY = elemDimensions.height + limits.maxY;
  }

  if (!limitBySize) {
    return limits;
  }

  if (internal) {
    limits.minX = 0;
    limits.minY = 0;
    limits.maxX = elemDimensions.width - itemDimensions.width;
    limits.maxY = elemDimensions.height - itemDimensions.height;

    if (
      itemDimensions.width > elemDimensions.width ||
      itemDimensions.height > elemDimensions.height
    ) {
      limits.maxX = 0;
      limits.maxY = 0;
    }
  } else if (itemDimensions.width || itemDimensions.height) {
    limits.maxX = 0;
    limits.maxY = 0;
    limits.minX = -itemDimensions.width + elemDimensions.width;
    limits.minY = -itemDimensions.height + elemDimensions.height;

    if (
      itemDimensions.width < elemDimensions.width ||
      itemDimensions.height < elemDimensions.height
    ) {
      limits.minX = 0;
      limits.minY = 0;
    }
  }

  return limits;
}

function calculateItemPosition(
  itemPosition,
  prevActivePosition,
  activePosition,
  multiplier
) {
  const newItemPosition = { ...itemPosition };

  const moveX = (activePosition.x - prevActivePosition.x) * multiplier;
  const moveY = (activePosition.y - prevActivePosition.y) * multiplier;

  newItemPosition.x += moveX;
  newItemPosition.y += moveY;

  return newItemPosition;
}

function alignItemOnPosition(elemDimensions, itemDimensions, position) {
  const oldMaxX = elemDimensions.width;
  const newMaxX = -(itemDimensions.width || 0) + elemDimensions.width;
  const oldMaxY = elemDimensions.height;
  const newMaxY = -(itemDimensions.height || 0) + elemDimensions.height;

  return {
    x: convertRange(0, oldMaxX, 0, newMaxX, position.x),
    y: convertRange(0, oldMaxY, 0, newMaxY, position.y)
  };
}

function centerItemOnPosition(elemDimensions, itemDimensions, position) {
  const itemPosition = alignItemOnPosition(
    elemDimensions,
    itemDimensions,
    position
  );

  itemPosition.x += elemDimensions.width / 2 - position.x;
  itemPosition.y += elemDimensions.height / 2 - position.y;

  return itemPosition;
}

export default {
  decorateChildren,
  preventDefault,
  convertRange,
  limitPosition,
  createAdjustedLimits,
  calculateItemPosition,
  alignItemOnPosition,
  centerItemOnPosition
};
