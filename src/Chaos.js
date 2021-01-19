import { isArray, isObject } from './utils';

let nextUnitOfWork = null;


function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
function render(element, container) {
  const dom =
    (typeof element === 'string' || element.type === "TEXT_ELEMENT")
      ? document.createTextNode(element)
      : document.createElement(element.type);
  const isProperty = key => key !== "children";
  if (isObject(element.props)) {
    Object.keys(element.props)
      .filter(isProperty)
      .forEach(name => {
        // TODO: add elment style
        dom[name] = element.props[name];
        // console.log(dom[name]);
        // dom.style.background = 'red';
      });
  }
  if (element.props) {
    const children = element.props.children;
    if (isArray(children)) {
      children.forEach(child => render(child, dom));
    } else if (isObject(children)) {
      render(children.props.children, dom);
    } else if (typeof children === 'string') {
      // text node
      render(children, dom);
    }
  }


  container.appendChild(dom);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    );
    // evnet loop 是否闲置
    // 1. https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
    // 2. https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline
    // 3. https://developer.mozilla.org/en-US/docs/Web/API/Background_Tasks_API
    // 4. https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/timeRemaining
    // 5. https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/didTimeout


    // If the idle period is over, the value is 0. 
    //Your callback can call this repeatedly to see if there's enough time left to do more work before returning
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}

requestIdleCallback(workLoop);

const Chaos = {
  createElement,
  render
};

export default Chaos;