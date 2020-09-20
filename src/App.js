import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Login from './Login';
import Register from './Register';
import NotFound from './components/NotFound';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>

            <hr />

            <Switch>
              <Route exact path="/" component={home} />
              <Route path="/login" component={login} />
              <Route path="/register" component={register} />
              <Route component={notFound} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}
const home = () => <h1>Home</h1>

const login = () => <Login />

const register = () => <Register />

const notFound = ({ location }) => <NotFound />

export default App;