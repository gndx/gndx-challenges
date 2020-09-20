import { Component } from 'react';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Facebook from './components/facebook';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: ''
        }
    }

    register = () => {
        if (this.state.email === '' || this.state.password === '') {
            //error
        } else {
            if (this.state.password === this.state.password2) {
                //if(this.state.email.exist)
                //{
                //error
                //}else
                //{
                //regiser
                //}
            }
        }
    }

    render() {
        return (<div>
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
                    /><br />
                    <TextField
                        type="password"
                        hintText="Confirm your Password"
                        floatingLabelText="Password"
                        onChange={(event, newValue) => this.setState({ password2: newValue })}
                    />
                    <br />
                    <RaisedButton label="Sigin" primary={true} style={{ margin: 15 }} onClick={(event) => this.handleClick(event)} />
                </div>
            </MuiThemeProvider>
            <Facebook />
        </div>);
    }
}

export default Register;