import React, { Component } from 'react';
import addressService from '../utils/addressService.js';
import '../static/css/address-bar.css';

class AddressBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            address: null,
            id: 'address-bar'
        };
    }

    componentDidMount(){
        addressService.suscribe(this.state.id, data => this.setState({ address: data }));
    }

    componentWillUnmount(){
        addressService.unsuscribe(this.state.id);
    }

    handleClick = e => {
        // Prevent toggle functionality from happening on desktop
        // Taken from MDN:
            // In summary, we recommend looking for the string
            // “Mobi” anywhere in the User Agent to detect a mobile device.
        if(!/Mobi/i.test(window.navigator.userAgent))
            return; 

        let first = true;
        for(let child of e.currentTarget.children){
            if(first){
                first = false;
                continue;
            }                
            child.classList.toggle('collapse')
        }
    }

    render(){
        return(
            <section id={this.state.id}>
                <div className="container" onClick={this.handleClick}>
                    <div className="data-cell">
                        <p>IP ADDRESS</p>
                        {
                            this.state.address &&
                            <h3> {this.state.address.ip}</h3>
                        }
                    </div>
                    <div className="divider"></div>
                    <div className="data-cell">
                        <p>LOCATION</p>
                        {
                            this.state.address &&
                            this.state.address.location &&
                            <h3>
                                {`${this.state.address.location.city}, `}
                                {/* {`${this.state.address.location.region}, `} */}
                                {`${this.state.address.location.country} `}
                                {this.state.address.location.postalCode}
                            </h3>
                        }
                    </div>
                    <div className="divider"></div>
                    <div className="data-cell">
                        <p>TIMEZONE</p>
                        {
                            this.state.address &&
                            this.state.address.location &&
                            <h3>{`UTC ${this.state.address.location.timezone}`}</h3>
                        }
                    </div>
                    <div className="divider"></div>
                    <div className="data-cell">
                        <p>ISP</p>
                        {
                            this.state.address &&
                            <h3>{this.state.address.isp}</h3>
                        }
                    </div>
                </div>
            </section>
        );
    }
}

export default AddressBar;