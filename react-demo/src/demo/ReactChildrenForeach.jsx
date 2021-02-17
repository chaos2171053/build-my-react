import React from 'react';

const FirstChild = ({ name }) => <li>{name}</li>;
FirstChild.displayName = 'FirstChild';

const SecondChild = ({ name }) => <li>{name}</li>;
SecondChild.displayName = 'SecondChild';

class ThirdChild extends React.Component {
  static displayName = 'ThirdChild';

  render() {
    return (
      <li>{this.props.name}</li>
    );
  }

}

class Parent extends React.Component {
  componentDidMount() {
    React.Children.forEach(this.props.children, child => {
      console.log('name =', child.type.displayName);
    });
  }

  render() {
    return (
      <ul>{this.props.children}</ul>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Parent>
        <FirstChild name='1st child value' />
        <SecondChild name='2nd child value' />
        <ThirdChild name='3rd child value' />
      </Parent>
    );
  }
}