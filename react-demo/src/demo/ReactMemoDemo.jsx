import React, { Component } from "react";

/**
 * Memoized component
 * Only updates when message changes
 */
const ScotchyComponent = props => <div>{props.message}</div>;

// create a version that only renders on prop changes
const MemoizedScotchyComponent = React.memo(ScotchyComponent);

// counter component
// we need a second moving component to trigger a render on our app
const Counter = props => <strong>{props.count}</strong>;

/**
 * Main App component
 */
class App extends Component {
  state = { count: 0, value: "my message goes here" };

  handleChange = e => this.setState({ value: e.target.value });
  handleClick = () => this.setState(({ count }) => ({ count: count + 1 }));

  render() {
    const { count, value } = this.state;

    return (
      <div className="hero is-fullheight has-text-centered">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              React.memo(): <Counter count={count} />
            </h1>

            <button
              type="button"
              className="button is-warning"
              onClick={this.handleClick}
            >
              Increase Count
            </button>

            {/* two columns to show components */}
            <input
              type="text"
              className="input"
              value={value}
              onChange={this.handleChange}
              style={{ marginTop: "30px", marginBottom: "30px" }}
            />

            {/* two columns to show components */}
            <div className="columns is-mobile">
              <div className="column">
                <ScotchyComponent message={value} />
              </div>
              <div className="column">
                <MemoizedScotchyComponent message={value} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
