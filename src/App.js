import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Facebook from './components/facebook';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Facebook />
      </div>
    );
  }
}

export default App;