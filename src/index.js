import React from 'react';
import Chaos from './Chaos';
import Promise from './lib/index';

const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});
Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
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