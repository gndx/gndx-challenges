import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Login from './Login';
import Register from './Register';
import NotFound from './components/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { RaisedButton, Toolbar } from 'material-ui';

class App extends Component {

  home = () => <h1>Home</h1>

  login = () => <Login />

  register = () => <Register onRegister={this.handleUser} />

  notFound = ({ location }) => <NotFound />

  handleUser = (user) => {
    this.setState({
      isLogged: user[0],
      email: user[1],
      name: user[2],
      picture: user[3]
    });
  }

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
            <Route exact path="/" component={this.home} />
            <Route path="/login" component={this.login} />
            <Route path="/register" component={this.register} />
            <Route component={this.notFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;