import { createElement, render, Component } from './toy-react.js';

class Counter extends Component {
  constructor() {
    super();
    this.state = { n: 0 };
  }
  render() {
    return (
      <div className="box" style={{ padding: '8px', border: '1px solid #ccc' }}>
        <h3>Count: {this.state.n}</h3>
        <button onClick={() => this.setState({ n: this.state.n + 1 })}>+1</button>
      </div>
    );
  }
}

render(<Counter />, document.getElementById('app'));