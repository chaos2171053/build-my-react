import React from 'react';

function List({ children }) {
  const extendedChildren = React.Children.map(children, (child) => {
    return React.cloneElement(
      child
    );
  });
  return (
    <>
      {extendedChildren}
    </>
  );
}

export default function App() {
  return (
    <>
      <List>
        <div>children 1</div>
        <div>children 2</div>
      </List>
    </>
  );
}