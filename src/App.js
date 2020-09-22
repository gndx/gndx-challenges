import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from './Login';
import Register from './Register';
import NotFound from './components/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { RaisedButton, Toolbar } from 'material-ui';
import Payment from './Payment';

class App extends Component {

  constructor() {
    super();
    this.state = {
      users: [['ab', 'ab', 'ab'], ['abc', 'abc', 'abc']],
      isLogged: false
    }
  }

  home = () => <h1>{}</h1>

  login = () => <Login />

  register = () => <Register onRegister={this.handleUser} />

  payment = () => <Payment onPay={this.handlePayment} />

  notFound = ({ location }) => <NotFound />

  handleUser = (user, logged) => {
    let dato = this.findUser(user[0]);
    console.log(dato[0], ' === -1: ', (dato[0] === '-1'));
    if (dato[0] !== '-1') {
      return false;
    }

    console.log('Users: ', this.state.users);
    
    this.setState({
      isLogged: logged,
      users: this.state.users.concat([user])
    });
    
    return true;
  }

  findUser = (email) => {
    this.state.users.forEach(element => {
      console.log('element: ', element);
      if (element[0] === email) {
        console.log(element[0], ' === ', email)
        return [element];
      }
    });
    
    return ['-1'];
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
                  <RaisedButton label="pay" primary={true} style={{ margin: 10 }} onClick={() => window.location = "/payment"} />
                </Toolbar>
              </AppBar>
            </div>
          </MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={this.home} />
            <Route path="/login" component={this.login} />
            <Route path="/register" component={this.register} />
            <Route path="/payment" component={this.payment} />
            <Route component={this.notFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;