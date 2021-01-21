import { isArray, isObject } from './utils';

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null; // the work in progress root
let deletions = null;


const isEvent = key => key.startsWith("on");

const isProperty = key =>
  key !== "children" && !isEvent(key);

const isNew = (prev, next) => key =>
  prev[key] !== next[key];

const isGone = (prev, next) => key => !(key in next);

const TEXT_ELEMENT = 'TEXT_ELEMENT';


function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
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
  // keep track of the root of the fiber tree.
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.removeEventListener(
        eventType,
        prevProps[name]
      );
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2);
      dom.addEventListener(
        eventType,
        nextProps[name]
      );
    });
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom);
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    );
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
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
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}


function reconcileChildren(wipFiber, elements) {

  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child;
  let index = 0;
  let prevSibling = null;
  // 处理文字节点
  if (typeof elements === 'string') {
    elements = [createTextElement(elements)];
  }
  // iterate at the same time over the children of the old fiber (wipFiber.alternate) 
  // and the array of elements we want to reconcile
  while (index < elements.length || oldFiber != null) {
    let element = elements[index];
    // 处理文字节点
    if (typeof element === 'string') {
      element = createTextElement(element);
    }

    let newFiber = null;

    // compare oldFiber to element

    const sameType =
      oldFiber &&
      element &&
      element.type === oldFiber.type;

    if (sameType) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // fiber 与 第一个子节点建立连接
    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    // 关联兄弟节点
    prevSibling = newFiber;
    index++;
  }
}

function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.props) {
    const elements = fiber.props.children;
    // 过滤<h2></h2>无子节点元素
    if (elements) {
      if (isObject(elements)) {
        reconcileChildren(fiber, [elements]);
      } else {
        reconcileChildren(fiber, elements);
      }
    }

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
  let dom = null;
  if (typeof fiber === 'string' || fiber.type === TEXT_ELEMENT) {
    if (fiber.props && fiber.props.children) {
      dom = document.createTextNode(fiber.props.children);
    }
  } else {
    dom = document.createElement(fiber.type);
  }
  updateDom(dom, {}, fiber.props);

  // if (isObject(fiber.props)) {
  //   Object.keys(fiber.props)
  //     .filter(isProperty)
  //     .forEach(name => {
  //       // TODO: add elment style
  //       dom[name] = fiber.props[name];
  //     });
  // }

  return dom;
}

//  when the browser is ready,call the requestIdleCallback
requestIdleCallback(workLoop);

const Chaos = {
  createElement,
  render
};

export default Chaos;