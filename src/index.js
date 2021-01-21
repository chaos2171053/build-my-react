import React from 'react';
import Chaos from './Chaos';


const container = document.getElementById("root");


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

// function component

function Text() {
  return (
    <div>666</div>
  );
}

function App(props) {
  return (
    <div>
      <h1>Hi {props.name}</h1>
      <Text />
    </div>
  )
    ;
}
const element = <App name="chaos" />;
Chaos.render(element, container);