import React from 'react';
const Hello = ({ name, newProp }) => <h1>Hello {name} and {newProp}!</h1>;

class Parent extends React.Component {
  render() {
    const { styles, children } = this.props;
    const newProp = 'Codesandbox';
    return (
      <div style={styles}>
        {React.Children.map(children, child => {
          return React.cloneElement(child, { newProp }, null);
        })}
      </div>
    );
  }
}
const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

export default class App extends React.Component {
  render() {
    return (
      <Parent style={styles}>
        <Hello name="abc" />
        <Hello name="abcd" />
      </Parent>
    );
  }
}