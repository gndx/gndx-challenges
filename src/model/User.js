class User {

    id = -1;
    email = '';
    password = '';
    withFacebook = false;
    image = '';

    constructor(props) {
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.withFacebook = props.withFacebook;
        this.image = props.image;
    }

}

export default User;