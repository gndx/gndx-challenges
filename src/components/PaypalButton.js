import React from "react";
import ReactDOM from "react-dom";
import paypal from 'paypal-checkout'

const PaypalButton = (order) => {
    const paypalConf = {
        currency: 'COP',
        env: 'sandbox',
        client: {
            sandbox: 'Ac9jCplwzW1vHefIq-qagLWdSXggfgGjZITgsx07veJOKEOFO6vmL6pCOYmTVyVsot9umXB0qP9WxD29',
            production: '',
        },
        style: {
            label: 'pay',
            size: 'small',
            shape: 'rect',
            color: 'gold'
        }
    };

    const PaypalButtonRef = paypal.Button.driver('react', { React, ReactDOM });

    const payment = (data, actions) => {
        const payment = {
            transactions: [
                {
                    amount: {
                        total: order.total,
                        currency: paypalConf.currency
                    },
                    
                    descripcion: 'Gracias por la compra',
                    custom: order.customer || '',
                    item_list: {
                        items: order.items
                    }
                }
            ],
            note: ''
        };

        return actions.payment.create({ payment });
    };

    const onAuthorize = (data, actions) => {
        return actions.payment.execute()
            .then(response => {
                alert('El pago se realizó correctamente. ${response.id}');
            })
            .catch(error => {
                alert('No se pudo realizar el pago. ERROR: ');
            });
    };

    const onError = (error) => {
        alert('No se pudo realizar el pago. Intentelo mas tarde.')
    };

    const onCancel = (data, actions) => {
        alert('Pago cancelado.');
    };

    return (<PaypalButtonRef
        env={paypalConf.env}
        client={paypalConf.client}
        style={paypalConf.style}
        payment={(data, actions) => payment(data, actions)}
        onAuthorize={(data, actions) => onAuthorize(data, actions)}
        onError={(error) => onError(error)}
        onCancel={(data, actions) => onCancel(data, actions)}
        commit
        locale='es_CO'
    />);
}

export default PaypalButton;