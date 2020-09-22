import { Component } from 'react';
import React from 'react';
import PaypalButton from './components/PaypalButton';

const order = {
    customer: '123',
    total: '80000',
    items: [
        {
            sku: '1',
            name: 'Bolso Tejido',
            price: '80000',
            quiantity: 1,
            currency: 'COP'
        }
    ]
}

class Payment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <PaypalButton order={order} />
            </div>
        );
    }
}

export default Payment;