import React from 'react';
import Chaos from './Chaos';

const updateValue = e => {
  rerender(e.target.value);
};
const container = document.getElementById("root");

const rerender = value => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  Chaos.render(element, container);
};
rerender("World");