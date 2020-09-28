import { Component } from 'react';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Facebook from './Facebook';
import { saveUser, loadUser, findUser } from '../model/FirebaseConnection';
import { saveCookie } from '../model/Cookies'
import User from '../model/User';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: ''
        }
    }

    getId = () => //no supe manejar al forma no asincrona del react, por lo que me retorna 1 antes de comparar si existe el usuario
    {
        let i = 1;
        do {
            if (loadUser(i) === undefined) {
                return i;
            }
            i++;
        } while (true);
    }

    register = () => { //Funciona
        if (this.state.email === '' || this.state.password === '') {
            alert('ERROR: Complete the data');
        } else {
            if (this.state.password === this.state.password2) {
                this.handleRegister(new User({
                    id: this.getId(),
                    email: this.state.email,
                    password: this.state.password,
                    withFacebook: false,
                    image: ''
                }));
            } else {
                alert("Different passwords");
            }
        }
    }

    registerFacebook = (user) => {
        this.handleRegister(user);
    }

    handleRegister = (user) => {
        if (findUser(user.email) === undefined) {
            saveUser(new User({
                id: user.id,
                email: user.email,
                password: user.password,
                image: user.image,
                withFacebook: user.withFacebook ? true : false
            }));
            saveCookie("id", user.id);
            saveCookie("email", user.email);
            window.location = '/';
        } else {
            alert(user.email + " already exist.")
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
                    <RaisedButton label="Sig in" primary={true} style={{ margin: 15 }} onClick={() => this.register()} />
                </div>
            </MuiThemeProvider>
            <Facebook text="sign in with facebook" handleUser={this.handleRegister} />
        </div>);
    }
}

export default Register;