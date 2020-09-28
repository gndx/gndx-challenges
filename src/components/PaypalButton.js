import React from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';

const PaypalButton = ({ order }) => {

  const paypalConf = {
    currency: 'USD',
    env: 'production',
    client: {
        sandbox: 'Ac9jCplwzW1vHefIq-qagLWdSXggfgGjZITgsx07veJOKEOFO6vmL6pCOYmTVyVsot9umXB0qP9WxD29',
        production: 'AZucpr-WNVLYty-coDp6rxs7_1HwnjI7iJF-snw7CCasnyizEhBPBKlpwsL4B9LbMOnw3AxKoHiy3Gwp',
    },
    style: {
      label: 'pay',
      size: 'small', // small | medium | large | responsive
      shape: 'pill', // pill | rect
      color: 'blue', // gold | blue | silver | black
    },
  };

  const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

  const payment = (data, actions) => {
    const payment = {
      transactions: [
        {
          amount: {
            total: order.total,
            currency: paypalConf.currency,
          },
          description: 'Compra en Tejiendo Amor',
          custom: order.customer || '',
          item_list: {
            items: order.items
          },
        },
      ],
      note_to_payer: 'Gracias por preferirnos',
    };
    return actions.payment.create({
      payment,
    });
  };

  const onAuthorize = (data, actions) => {
    return actions.payment.execute()
      .then(response => {
        console.log(response);
        alert('gracias '+order.customer+ ' por la compra, ID:'+response.id)
      })
      .catch(error => {
        console.log(error);
	      alert('Ocurrió un error al procesar el pago con Paypal');
      });
  };

  const onError = (error) => {
    alert (error);
  };

  const onCancel = (data, actions) => {
    alert( 'Compra cancelada.' );
  };


  return (
    <PayPalButton
      env={paypalConf.env}
      client={paypalConf.client}
      payment={(data, actions) => payment(data, actions)}
      onAuthorize={(data, actions) => onAuthorize(data, actions)}
      onCancel={(data, actions) => onCancel(data, actions)}
      onError={(error) => onError(error)}
      style={paypalConf.style}
      commit
      locale="es_CO"
    />

  );
}

export default PaypalButton;