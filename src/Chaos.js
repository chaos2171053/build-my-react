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
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
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

function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    // fiber 与 第一个子节点建立连接
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    // 第一个子节点是其他子节点的兄弟节点
    prevSibling = newFiber;
    index++;
  }
  //  return next unit of work

  // 如果有子节点，则把第一个子节点作为下一个 unit work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    // 如果有兄弟节点，则把兄弟节点作为下一个 unit work
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 否则，向上寻找兄弟节点
    nextFiber = nextFiber.parent;
  }
}

function createDom(fiber) {
  const dom =
    (typeof fiber === 'string' || fiber.type === "TEXT_ELEMENT")
      ? document.createTextNode(fiber)
      : document.createElement(fiber.type);

  const isProperty = key => key !== "children";
  if (isObject(fiber.props)) {
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach(name => {
        // TODO: add elment style
        dom[name] = fiber.props[name];
      });
  }

  return dom;
}

//  when the browser is ready,call the requestIdleCallback
requestIdleCallback(workLoop);

const Chaos = {
  createElement,
  render
};

export default Chaos;