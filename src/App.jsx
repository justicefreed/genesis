import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
// import HelloWorld from './components/hello-world';
import Game from './components/tutorial-game';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  render() {
    // return <HelloWorld title="Hello from React webpack" />;
    return <Game />;
  }
}

export default hot(module)(App);
