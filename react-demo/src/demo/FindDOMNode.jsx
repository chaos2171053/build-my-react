import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Comp extends Component {
  inner() {
    console.log('inner');
  }
  render() {
    return (
      <div>
        <input type="input" />
      </div>
    );
  }
}

class App extends Component {
  componentDidMount() {
    const myComp = this.refs.myComp;
    myComp.inner();  //访问子组件的函数
    const dom = ReactDOM.findDOMNode(myComp);
    dom.childNodes[0].value = 'hello';
    dom.childNodes[0].focus();
  }
  render() {
    return (
      <div>
        <Comp ref="myComp" />
      </div>
    );
  }
}

export default App;