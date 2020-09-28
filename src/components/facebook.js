import React from 'react';
import FacebookLogin from 'react-facebook-login';
import User from '../model/User'

class Facebook extends React.Component {
    state = {
        isLogged: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        if (response.picture !== undefined) {
            this.setState({
                isLogged: true,
                userID: response.userID,
                name: response.name,
                email: response.email,
                picture: response.picture.data.url
            });

            this.props.handleUser(new User({
                id: response.userID,
                email: response.email,
                password: '',
                withFacebook: true,
                image: response.picture.data.url
            }));
        }
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
                    <h2>Welcome {this.state.name}</h2>
                </div>
            );
        } else {
            fbContent = (<FacebookLogin
                appId='702551557001989'
                autoLoad={false}
                textButton={this.props.text}
                icon={
                    <svg id="Facebook" enable-background="new 0 0 512 512" viewBox="0 0 512 512" height="20" width="40"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="m256 256c0-141.4-114.6-256-256-256s-256 114.6-256 256 114.6 256 256 256c1.5 0 3 0 4.5-.1v-199.2h-55v-64.1h55v-47.2c0-54.7 33.4-84.5 82.2-84.5 23.4 0 43.5 1.7 49.3 2.5v57.2h-33.6c-26.5 0-31.7 12.6-31.7 31.1v40.8h63.5l-8.3 64.1h-55.2v189.5c107-30.7 185.3-129.2 185.3-246.1z" fill="#ffffff" />
                    </svg>
                }
                fields="name,email,picture"
                callback={this.responseFacebook}
            />)
        }

        return <div>{fbContent}</div>;
    }
}

export default Facebook;