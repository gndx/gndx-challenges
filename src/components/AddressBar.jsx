import React, { Component } from 'react';
import addressService from '../utils/addressService.js';
import '../static/css/address-bar.css';
import btnIcon from '../static/images/up-arrow-angle.svg'

class AddressBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: 'address-bar',
            online: false,
            ip: null,
            location: null,
            timezone: null,
            isp: null
        };
    }

    getLocation = data => {
        let location = 'unavailable';
        if(data)
            location = `${data.city ? data.city + ',' : ''} ${data.country.name ? data.country.name : ''} ${data.postal ? data.postal : ''}`;
        return location;
    }

    getTimezone = data => {
        let timezone = 'unavailable';
        if(data)
            timezone = `UTC ${data.offset ? data.offset / 3600 + ':00' : ''}`
        return timezone;
    }

    componentDidMount(){
        addressService.suscribe(this.state.id, data => {
            this.setState(data ? 
                {
                    online: true,
                    ip: data.ip ? data.ip : 'unavailable',
                    location: this.getLocation(data.location),
                    timezone: this.getTimezone(data.time_zone),
                    isp: data.connection ? data.connection.organization : 'unavailable'
                }
                : { online: false }
            );
        });
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
                // where children[2] refers to the collapse button container
                child.children[2].children[0].classList.toggle('collapse-btn-pressed');

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
                    {
                        this.state.online ?
                        <>
                            <div className="data-cell">
                                <p>IP ADDRESS</p>
                                <h3>{this.state.ip}</h3>
                                <div className="collapse-btn-container">
                                    <img src={btnIcon} alt="Collapse button"/>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="data-cell">
                                <p>LOCATION</p>
                                <h3>{this.state.location}</h3>
                            </div>
                            <div className="divider"></div>
                            <div className="data-cell">
                                <p>TIMEZONE</p>
                                <h3>{this.state.timezone}</h3>
                            </div>
                            <div className="divider"></div>
                            <div className="data-cell">
                                <p>ISP</p>
                                <h3>{this.state.isp}</h3>
                            </div>
                        </>
                        : 
                        <div className="data-cell">
                            <p>Oops! something went wrong</p>
                            <h3>Service unavailable :c</h3>
                        </div>
                    }
                </div>
            </section>
        );
    }
}

export default AddressBar;