import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { ImFacebook } from 'react-icons/im';

class Facebook extends React.Component {
    state = {
        isLogged: false,
        userID: '',
        name: '',
        email: '',
        picture: ''
    }

    responseFacebook = response => {
        this.setState({
            isLogged: true,
            userID: response.userID,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        })
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
                    {
                    //window.location="/404.js"
                }
                </div>
            );
        } else {
            fbContent = (<FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_TOKEN}
                autoLoad={true}
                textButton="    Sign In With Facebook"
                icon={<ImFacebook />}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
            />)
        }

        return <div>{fbContent}</div>;
    }

    componentClicked = () => {
        console.log("clicked");
    }
}

export default Facebook;