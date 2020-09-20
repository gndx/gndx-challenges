import { Component } from 'react';
import React from 'react';
import Facebook from './components/facebook';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    render() {
        return (
            <div id="loginForms">
                <MuiThemeProvider>
                    <div>
                        <AppBar
                            title="Tejiendo AMOR 💞"
                            showMenuIconButton={false}
                        />
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
                        <RaisedButton label="login" primary={true} style={{margin: 15}} onClick={(event) => this.handleClick(event)} />
                        <br />
                    </div>
                </MuiThemeProvider>
                <Facebook />
            </div>
        );
    }
}

export default Login;