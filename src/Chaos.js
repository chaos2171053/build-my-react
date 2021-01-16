import { isArray, isObject } from './utils';
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
        dom[name] = element.props[name];
      });
  }
  if (element.props) {
    const children = element.props.children;

    if (isArray(children)) {
      children.forEach(child => render(child, dom));
    } else if (isObject(children)) {
      render(children.props.children, dom);
    } else if (typeof children === 'string') {
      render(children, dom);
    }
  }


  container.appendChild(dom);
}


const Chaos = {
  createElement,
  render
};

export default Chaos;