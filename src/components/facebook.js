import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { ImFacebook } from 'react-icons/im';

class Facebook extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isLogged: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        this.setState({
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        });
        
        this.props.onRegister([
            response.email,
            '',
            response.picture.data.url,
            'facebook'
        ]);
        
        window.location="/"
    }

    render() {
        let fbContent;

        if (this.state.isLogged) {
            fbContent = (
                <div style={{
                    width: '400px',
                    margin: 'auto',
                    background: '#f4f4f4',
                    padding: '20px'
                }}>
                    <img src={this.state.picture} alt={this.state.name} />
                    <h2>Welcome Back {this.state.name}</h2>
                </div>
            );
        } else {
            fbContent = (<FacebookLogin
                appId='702551557001989'
                autoLoad={false}
                textButton="    Sign In With Facebook"
                icon={<ImFacebook />}
                fields="name,email,picture"
                callback={this.responseFacebook}
            />)
        }

        return <div>{fbContent}</div>;
    }
}

export default Facebook;