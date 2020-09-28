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

const saveUser = (user) => {
    firebase.database().ref('users').child(user.id).set({
        email: user.email,
        password: user.password,
        withFacebook: user.withFacebook,
        image: user.image
    });
}

const loadUser = (id) => {
    const nameRef = firebase.database().ref().child('users').child(id);
    nameRef.on('value', (snapshot) => {
        if (snapshot.val() === null) {
            return null;
        } else {
            return snapshot.val();
        }
    });
}

const findUser = (email) => { //No supe como buscar registro por registro el correo
    const nameRef = firebase.database().ref().child('users');
    nameRef.on('value', (snapshot) => {
        if (snapshot.val().email === email) {
            return snapshot.val().child;
        } else {
            return null;
        }
    });
}

export { saveUser, loadUser, findUser };