import React from 'react';
import * as ReactDOM from 'react';

let notifications = [];
function addNotification(notification) {
  notifications = [...notifications, notification];
}

function removeNotification(notification) {
  const index = notifications.indexOf(notification);
  notifications = [
    ...notifications.splice(0, index),
    ...notifications.splice(index + 1)
  ];
}

export default function Application({ children }) {
  const extendedChildren = React.children.map(children, (child) => {
    return React.cloneElement(
      child,
      {
        notifications,
        removeNotification,
        addNotification
      }
    );
  });

  return (
    <div>
      {extendedChildren}
    </div>
  );
}