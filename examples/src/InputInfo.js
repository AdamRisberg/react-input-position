import React from "react";

const InputInfo = (props) => {
  const {
    active,
    activePosition,
    prevActivePosition,
    passivePosition,
    elementDimensions,
    elementOffset,
    itemPosition
  } = props;

  return (
    <div className={`input-info ${active ? "color-active" : ""}`}>
      <div>
        Active: {active.toString()}
      </div>
      <div>
        Active Position X: {activePosition.x}<br/>
        Active Position Y: {activePosition.y}
      </div>
      <div>
        Previous Active Position X: {prevActivePosition.x}<br/>
        Previous Active Position Y: {prevActivePosition.y}
      </div>
      <div>
        Passive Position X: {passivePosition.x}<br/>
        Passive Position Y: {passivePosition.y}
      </div>
      <div>
        Element Width: {elementDimensions.width}<br/>
        Element Height: {elementDimensions.height}
      </div>
      <div>
        Element Offset Left: {elementOffset.left}<br/>
        Element Offset Top: {elementOffset.top}
      </div>
      <div>
        Item Position X: {itemPosition.x}<br/>
        Item Position Y: {itemPosition.y}
      </div>
    </div>
  );
};

export default InputInfo;