import React from 'react';
import Chaos from './Chaos';

const element = (
  <div>
    <h1>Hello World</h1>
    <h2>from chaos</h2>
  </div>
);
const container = document.getElementById("root");
Chaos.render(element, container);