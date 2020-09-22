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

import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAlgQN0IVZG5GPZCjdGevH_UYbKkpzwsfY',
  authDomain: 'tejiendoamor-9d287.firebaseapp.com',
  databaseURL: 'https://tejiendoamor-9d287.firebaseio.com',
  projectId: 'tejiendoamor-9d287',
  storageBucket: 'tejiendoamor-9d287.appspot.com',
  messagingSenderId: '425729663197',
  appId: '1:425729663197:web:f4c937465e7489810ffb34',
  measurementId: 'G-26G4E2NXRS'
}

firebase.initializeApp(config);
class App extends Component {

  constructor() {
    super();
    this.state = {
      picture: '',
      id: -1,
      isLogged: false
    }
  }

  componentWillMount() {
    this.findUserByEmail('sanbope15@gmail.com');
  }

  home = () => <h1>{this.state.id + '- ' + this.state.email}</h1>

  login = () => <Login />

  register = () => <Register onRegister={this.handleUser} />

  payment = () => <Payment onPay={this.handlePayment} />

  notFound = ({ location }) => <NotFound />

  handleUser = (user) => {
    let exist = this.findUserByEmail(user[0]);

    console.log(exist, ' === true: ', (exist === true));
    if (exist) {
      return true;
    }

    this.saveUser(user);

    return false;
  }

  saveUser = (user) => {
    let tempId = this.getId();
    const dbRef = firebase.database().ref('users').child(tempId);
    dbRef.set({
      email: user[0],
      password: user[1],
      picture: user[2],
      platform: user[3]
    });
  }

  getId = () => {
    return 1;
  }

  findUser = (id) => {
    const nameRef = firebase.database().ref().child('users').child(id);
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() === null) {
        return false;
      } else {
        this.setState({
          id: id,
          email: snapshot.val().email
        });
        return true;
      }
    });
  }

  findUserByEmail = (email) => {
    const nameRef = firebase.database().ref().child('users');
    let tempId, tempEmail = '';
    nameRef.on('value', (snapshot) => {
      snapshot.forEach(function (data) {
        if (data.val().email === email) {
          tempId = data.key;
          tempEmail = email;
        }
      });
      if (tempEmail === '') {
        return false;
      } else {
        this.setState({
          id: tempId,
          email: tempEmail
        });
      }
      return true;
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