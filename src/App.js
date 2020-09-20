import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Login from './Login';
import Register from './Register';
import NotFound from './components/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { RaisedButton, Toolbar } from 'material-ui';
import Button from '@material-ui/core/Button';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <MuiThemeProvider>
            <div>
              <AppBar
                title="Tejiendo AMOR 💞"
                position="static"
                showMenuIconButton={false}
              >
                <Toolbar style={{ background: '#00BCD4', alignSelf: 'center' }}>
                  <RaisedButton label="login" primary={true} style={{ margin: 10 }} onClick={() => window.location = "/login"} />
                  <RaisedButton label="sigin" primary={true} style={{ margin: 10 }} onClick={() => window.location = "/register"} />
                </Toolbar>
              </AppBar>
            </div>
          </MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={home} />
            <Route path="/login" component={login} />
            <Route path="/register" component={register} />
            <Route component={notFound} />
          </Switch>
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