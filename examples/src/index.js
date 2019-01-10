import React, { Component } from "react";
import ReactDOM from "react-dom";

import ImageExample from "./ImageExample";
import ExampleContainer from "./ExampleContainer";
import PropsExample from "./PropsExample";
import Header from "./Header";

import "./style.css";

class DemoApp extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="app">
          <ExampleContainer title="Basic Demo">
            <PropsExample />
          </ExampleContainer>
          <ExampleContainer title="Example Usage">
            <ImageExample />
          </ExampleContainer>
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<DemoApp />, document.getElementById("root"));
