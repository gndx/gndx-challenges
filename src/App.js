import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from './components/NotFound';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { RaisedButton, Toolbar } from 'material-ui';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { loadCookie, deleteCookie } from './model/Cookies';

class App extends Component {

  home = () => <Home />

  login = () => <Login />
  register = () => <Register />
  notFound = ({ location }) => <NotFound />

  //Get the user with id or email entered
  getUser = (id) => {
    let index = -1;

    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        i = this.users.length;
      } else if (this.users[i].email === id) {
        index = i;
        i = this.users.length;
      }
    }

    return this.users[index] === undefined ? 'none' : this.users[index];
  }

  _topButtons() {
    if (loadCookie("id") === undefined) {
      return (
        <Toolbar style={{ background: '#00BCD4', alignSelf: 'center' }}>
          <RaisedButton icon={

            <svg id="userLogo" width="20" height="20" viewBox="0 46 612 612" enable-background="new 0 46 612 612"
              xmlns="http://www.w3.org/2000/svg">
              <g>
                <g>
                  <path d="M527.091,140.164C469.329,79.873,389.408,45.847,305.912,46C137.175,45.788,0.212,182.404,0,351.143
			c-0.105,83.436,33.917,163.283,94.164,221.004c0.175,0.175,0.241,0.437,0.415,0.591c1.77,1.704,3.692,3.146,5.485,4.785
			c4.916,4.37,9.833,8.893,15.011,13.11c2.774,2.186,5.659,4.369,8.5,6.38c4.895,3.648,9.789,7.297,14.901,10.663
			c3.475,2.186,7.059,4.369,10.619,6.555c4.719,2.841,9.418,5.702,14.291,8.303c4.13,2.186,8.346,4.063,12.542,6.052
			c4.588,2.186,9.112,4.369,13.809,6.336s9.417,3.496,14.18,5.2s8.871,3.278,13.438,4.676c5.157,1.552,10.445,2.753,15.688,4.042
			c4.37,1.07,8.609,2.294,13.11,3.169c6.03,1.202,12.148,1.966,18.267,2.797c3.781,0.525,7.473,1.268,11.296,1.639
			c10.008,0.983,20.102,1.53,30.283,1.53c10.183,0,20.277-0.547,30.284-1.53c3.824-0.371,7.517-1.113,11.296-1.639
			c6.118-0.831,12.235-1.595,18.267-2.797c4.369-0.875,8.74-2.186,13.11-3.169c5.243-1.289,10.531-2.491,15.688-4.042
			c4.566-1.397,8.979-3.102,13.438-4.676c4.458-1.573,9.526-3.277,14.18-5.2c4.654-1.923,9.221-4.174,13.81-6.336
			c4.195-1.988,8.412-3.868,12.541-6.052c4.873-2.601,9.57-5.463,14.291-8.303c3.562-2.186,7.145-4.174,10.618-6.555
			c5.113-3.364,10.008-7.014,14.901-10.663c2.841-2.186,5.724-4.152,8.499-6.38c5.179-4.152,10.096-8.565,15.012-13.11
			c1.791-1.639,3.714-3.08,5.484-4.785c0.174-0.152,0.241-0.415,0.415-0.591C639.68,455.414,643.824,262.009,527.091,140.164z
			 M477.981,549.27c-3.977,3.496-8.085,6.817-12.235,10.029c-2.447,1.88-4.895,3.736-7.408,5.528
			c-3.954,2.863-7.975,5.572-12.062,8.172c-2.972,1.901-6.008,3.736-9.067,5.528c-3.847,2.186-7.758,4.37-11.713,6.556
			c-3.496,1.791-7.058,3.475-10.64,5.135s-7.538,3.43-11.406,4.981c-3.867,1.552-7.975,3.015-12.018,4.37
			c-3.692,1.267-7.385,2.578-11.122,3.691c-4.369,1.312-8.937,2.382-13.459,3.475c-3.54,0.83-7.035,1.77-10.619,2.47
			c-5.179,1.005-10.466,1.704-15.775,2.425c-3.015,0.394-6.008,0.94-9.046,1.246c-8.392,0.808-16.891,1.289-25.478,1.289
			s-17.087-0.48-25.478-1.289c-3.037-0.306-6.03-0.853-9.046-1.246c-5.309-0.721-10.597-1.42-15.775-2.425
			c-3.583-0.698-7.08-1.639-10.619-2.47c-4.523-1.092-9.025-2.185-13.459-3.475c-3.736-1.113-7.43-2.425-11.122-3.691
			c-4.042-1.398-8.085-2.819-12.018-4.37c-3.933-1.552-7.647-3.256-11.406-4.981c-3.759-1.726-7.146-3.343-10.641-5.135
			c-3.955-2.054-7.866-4.218-11.712-6.556c-3.059-1.791-6.097-3.627-9.068-5.528c-4.085-2.6-8.107-5.309-12.062-8.172
			c-2.513-1.791-4.96-3.648-7.408-5.528c-4.152-3.212-8.259-6.555-12.235-10.029c-0.962-0.721-1.836-1.639-2.774-2.47
			c0.977-74.328,48.727-139.96,119.148-163.766c35.211,16.75,76.093,16.75,111.304,0c70.42,23.806,118.171,89.436,119.148,163.766
			C479.794,547.631,478.92,548.462,477.981,549.27z M229.719,221.19c23.658-42.075,76.944-57.004,119.02-33.346
			c42.074,23.658,57.004,76.944,33.346,119.019c-7.85,13.96-19.385,25.495-33.346,33.346c-0.109,0-0.241,0-0.372,0.131
			c-5.794,3.225-11.918,5.819-18.267,7.735c-1.136,0.328-2.186,0.764-3.386,1.048c-2.186,0.568-4.48,0.961-6.73,1.354
			c-4.238,0.741-8.525,1.171-12.826,1.29h-2.491c-4.301-0.118-8.588-0.548-12.826-1.29c-2.186-0.393-4.501-0.786-6.729-1.354
			c-1.159-0.284-2.185-0.721-3.386-1.048c-6.349-1.917-12.472-4.509-18.267-7.735l-0.393-0.131
			C220.99,316.551,206.061,263.265,229.719,221.19z M519.474,503.473L519.474,503.473
			c-14.021-65.399-57.087-120.845-116.984-150.611c48.964-53.336,45.417-136.269-7.92-185.232
			c-53.338-48.964-136.27-45.418-185.233,7.919c-46.031,50.143-46.031,127.172,0,177.313
			c-59.897,29.769-102.963,85.212-116.985,150.611c-83.786-118.019-56.035-281.614,61.984-365.4
			c118.019-83.786,281.615-56.035,365.401,61.984c31.496,44.365,48.403,97.434,48.376,151.843
			C568.112,406.261,551.105,459.26,519.474,503.473z"/>
                </g>
              </g>
            </svg>

          } label="login" primary={true} style={{ margin: 10 }
          } onClick={() => window.location = "/login"
          } />
          < RaisedButton label="sigin" primary={true} style={{ margin: 10 }} onClick={() => window.location = "/register"} />
          < RaisedButton label="pay" primary={true} style={{ margin: 10 }} onClick={() => window.location = "/payment"} />
        </Toolbar >
      );
    } else {
      return (
        <Toolbar style={{ background: '#00BCD4', alignSelf: 'center' }}>
          <RaisedButton label={loadCookie("email")} primary={true} style={{ margin: 10 }} onClick={() => window.location = "/"} />
          <RaisedButton label="LogOut" primary={true} style={{ margin: 10 }} onClick={() => {
            deleteCookie("id");
            deleteCookie("email");
            window.location = "/login"
          }} />
        </Toolbar>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <MuiThemeProvider>
            <div>
              <AppBar
                title="Tejiendo Amor 💞"
                position="static"
                showMenuIconButton={false}
              >
                {this._topButtons()}
              </AppBar>
            </div>
          </MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={this.home} />
            <Route path="/login" component={this.login} />
            <Route exact path="/register" component={this.register} />
            <Route path="/payment" component={this.payment} />
            <Route component={this.notFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;