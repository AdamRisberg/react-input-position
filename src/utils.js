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
};

export default {
  decorateChildren,
  preventDefault
};