export default class Greeting extends React.Component {
  static defaultProps = {
    name: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: 'world'
    };
  }
  componentDidMount() {
  }
  render() {
    return <h1>Hello, {this.state.name}</h1>;
  }
}
Greeting.defaultProps = {
  name: 'blue'
};
