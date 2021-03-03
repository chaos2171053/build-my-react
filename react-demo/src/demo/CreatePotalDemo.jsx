import React from "react";
import ReactDOM from "react-dom";

export const overlay = {
  height: "100%",
  width: "100%",
  position: "fixed",
  StayInPlaceZIndex: "1",
  SitOnTopLeft: "0",
  top: "0",
  backgroundColor: "rgb(0,0,0)",
  BlackFallbackColorBackgroundColor: "rgba(0,0,0, 0.9)",
  BlackWOpacityOverflowX: "hidden",
  DisableHorizontalScrollTransition: "0.5s"
};

export const overlayContent = {
  position: "relative",
  top: "25%",
  width: "100%",
  textAlign: "center",
  marginTop: "30px",
  color: "white"
};


class Overlay extends React.Component {
  constructor(props) {
    super(props);
    // Create container DOM element and append to DOM.
    this.overlayContainer = document.createElement("div");
    document.body.appendChild(this.overlayContainer);
  }

  componentWillUnmount() {
    document.body.removeChild(this.overlayContainer);
  }

  render() {
    return ReactDOM.createPortal(
      <div style={overlay}>
        <div style={overlayContent}>{this.props.children}</div>
      </div>,
      this.overlayContainer
    );
  }
}

export default class App extends React.Component {
  state = {
    showOverlay: false
  };

  toggleOverlay = () => {
    this.setState(prevState => {
      return { showOverlay: !prevState.showOverlay };
    });
  };

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        {this.state.showOverlay && (
          <Overlay>
            <div>
              Overlay Content{" "}
              <button onClick={this.toggleOverlay}>Close</button>
            </div>
          </Overlay>
        )}
        <button onClick={this.toggleOverlay}>Open Overlay</button>
      </div>
    );
  }
}