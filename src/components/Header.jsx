import React, { Component, createRef } from 'react';
import { ipregistryAPIKey } from '../utils/credentials.js';
import { urlProtocolRegex, urlRegex, ipRegex } from '../utils/regex-weburl.js';
import addressService from '../utils/addressService.js';
import axios from 'axios';
import '../static/css/header.css'

class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            address: '',
            ref: createRef()
        };
    }

    reportIpLocation = async ip => {
        /* 
         * For some unknown reason, doing a request to any of these APIs
         * results in a empty response with a 200 OK status
         */
        // let apiUri = `https://geo.ipify.org/api/v1?apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`
        // let apiUri = `https://api.ipstack.com/190.199.123.216?access_key=${ipstackAPIKey}`;
        // let apiUri = 'http://ip-api.com/json/24.48.0.1';
        // let apiUri = 'https://ipapi.co/8.8.8.8/json/';
        // let apiUri = ' https://freegeoip.app/json/8.8.8.8';
        // let apiUri = 'https://extreme-ip-lookup.com/json/63.70.164.200'
        // let apiUri = 'https://api.ipdata.co/8.8.8.8?api-key=test'
        
        /*
         * These were the only APIs which returned the expected response
         *  API was chosen based on https support.
         */
        // let apiUri = 'http://ipwhois.app/json/8.8.4.4';
        let apiUri = `https://api.ipregistry.co/${ip}?key=${ipregistryAPIKey}`

        await axios.get(apiUri)
            .then(res => addressService.notify(res.data))
            .catch(err => console.log(err));
    };
    
    validateAndSubmit = async () => {
        if(urlRegex.test(this.state.address)) { // Is url
            await axios.get(`https://dns.google/resolve?name=${this.state.address}`)
            .then(res => {
                let answer = res.data.Answer;
                for(let i in answer){
                    if(answer[i].type === 1) {
                        this.reportIpLocation(answer[i].data);
                        break;
                    }
                }
            }).catch(err => console.log(err));
        }else if(ipRegex.test(this.state.address)) // Is IP. 
            // Remove protocol from IP if neccessary
            this.reportIpLocation(this.state.address.replace(urlProtocolRegex, ''));
    };
    
    handleSearch = e => {
        this.validateAndSubmit();
        
        this.setState({address: ''})
        e.preventDefault();
        e.stopPropagation();
    };

    render() {
        return (
            <header>
                <div ref={this.state.ref} className="hero">
                    <h2>IP Address Tracker</h2>
                    <form id="search" onSubmit={this.handleSearch}>
                        <div>
                            <input type="text" 
                                placeholder="Search for any IP address or domain"
                                value={this.state.address}
                                onChange={e => this.setState({address: e.target.value})}    
                            />
                            <button type="submit" form="search">&gt;</button>
                        </div>
                    </form>
                </div>
            </header>
        );
    }

    componentDidMount() {
        this.setState({ address: ''});
        addressService.reportHeight(this.state.ref.current.clientHeight);

        // Initial ip
        this.reportIpLocation('8.8.8.8');
    };
}

export default Header;