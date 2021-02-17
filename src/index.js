import React from 'react';
import Chaos from './Chaos';
import Promise from './lib/index';

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('error');
  }, 300);
});

myPromise.catch(err => {
  console.log(err);
});

const container = document.getElementById("root");

// feature 1: host component
// const updateValue = e => {
//   rerender(e.target.value);
// };
// const rerender = value => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   Chaos.render(element, container);
// };
// rerender("World");



// feature 2: function component
// function Text() {
//   return (
//     <div>666</div>
//   );
// }

// function App(props) {
//   return (
//     <div>
//       <h1>Hi {props.name}</h1>
//       <Text />
//     </div>
//   )
//     ;
// }
// const element = <App name="chaos" />;
// Chaos.render(element, container);

// feature 3: hooks

function Counter() {
  const [state, setState] = Chaos.useState(1);
  const onClick = () => {
    setState(c => c + 1);
  };
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={onClick}>Click Me</button>
    </div>
  );
}
const element = <Counter />;
Chaos.render(element, container);