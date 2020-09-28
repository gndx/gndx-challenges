import React, { Component } from 'react';
import PaypalButton from './PaypalButton'
import {loadCookie} from '../model/Cookies'

class Home extends Component {
    getImage = (image) => {
        try {
            return require('../assets/items/' + image + '.jpg');
        } catch
        {
            console.log(image + ".jpg no existe")
        }
    }

    item = (props) => { //aqui la idea es  manejar todo el almacen con redux. pero aun no se usarlo bien y me quedé sin tiempo. así que solo quemé los datos
        return (
            <div style={{
                margin: 5,
                width: 200,
                height: 410,
                fontSize: 15,
                border: '1px solid red',
                borderColor: 'black',
                borderWidth: 3,
                textAlign: 'center',
            }}>
                <img src={this.getImage(props.image)} width='200px' height='200px' />
                <h1>{props.title}</h1>
                <h3>Price: ${props.price} USD</h3>
                <h6>Stock: {props.stock}</h6>
                {this._payLoginButton(props)}
            </div>
        );
    }

    _payLoginButton = (props) =>
    {
        if (loadCookie("id") === undefined) {
            return (
            <button
            onClick={() => window.location = "/login"}
            >Login</button>
        );
        }else
        {
        return (
            <PaypalButton order={{
                customer: loadCookie("email"),
                total: props.price,
                items: [
                    {
                        sku: props.image,
                        name: props.title,
                        price: props.price,
                        quantity: 1,
                        currency: 'USD'
                    }
                ]
            }}/>
        );
        }
    }

    render() {
        return (
                <div style={{
                    padding: 50,
                    display: 'flex'
                }}>
                    {this.item({
                        image: '1',
                        title: 'bolso tejido 1',
                        price: 20.59,
                        stock: 2
                    })}
                    {this.item({
                        image: '2',
                        title: 'bolso tejido 2',
                        price: 5,
                        stock: 1
                    })}
                </div>
        );
    }
}

export default Home