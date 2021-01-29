import React from 'react';
import './App.css';

// export default function App() {
//   const Test = React.createElement(
//     "h1", { className: "main" }, "Hello World"
//   );
//   return (
//     <div className="App">
//     </div>
//   );
// }
export default class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'world'
    };
  }
  componentDidMount() {
    console.log(123);

  }
  render() {
    return <h1>Hello, {this.state.name}</h1>;
  }
}
