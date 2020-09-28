import { Component } from 'react';
import React from 'react';
import Facebook from './Facebook';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { findUser, loadUser, saveUser } from '../model/FirebaseConnection';
import { saveCookie } from '../model/Cookies'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    login = () => {
        let loadedUser = findUser(this.state.email);

        if (loadedUser !== undefined) {
            this.handleLogin(loadedUser);
        } else {
            //alert("Este usuario no existe");
        }
        alert("Please login with facebook account.") //No supe manejar la forma no asincrona de react
    }

    loginFacebook = (user) => {
        if (loadUser(user.id) === undefined) {
            saveUser(user);
        }
        this.handleLogin(user);
    }

    handleLogin = (user) => {
        saveCookie("id", user.id);
        saveCookie("email", user.email);
        window.location = '/';
    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <br />
                        <br />
                        <TextField
                            hintText="Enter your Email"
                            floatingLabelText="Email"
                            onChange={(event, newValue) => this.setState({ email: newValue })}
                        />
                        <br />
                        <TextField
                            type="password"
                            hintText="Enter your Password"
                            floatingLabelText="Password"
                            onChange={(event, newValue) => this.setState({ password: newValue })}
                        />
                        <br />
                        <RaisedButton label="login" primary={true} style={{ margin: 15 }} onClick={() => this.login()} />
                        <br />
                    </div>
                </MuiThemeProvider>
                <Facebook text="login with facebook" handleUser={this.loginFacebook} />
            </div>
        );
    }
}

export default Login;