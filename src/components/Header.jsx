import React, { Component, createRef } from 'react';
import { geoIpifyAPIKey, geoIpifyAPIUrl } from '../utils/credentials.js';
import { urlProtocolRegex, urlRegex, ipRegex } from '../utils/regex-weburl.js';
import addressService from '../utils/addressService.js';
import '../static/css/header.css'

class Header extends Component {
    constructor(props){
        super(props);

        this.state = {
            address: '',
            ref: createRef()
        };
    }

    reportIpLocation = (ip) => {
        let http = require('http');
        http.get(`${geoIpifyAPIUrl}apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`, res => {
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => addressService.notify(JSON.parse(rawData)) );
        }).end();
    };
    
    validateInput = () => {
        let ip;
        if(urlRegex.test(this.state.address)) { // Is url
            // TODO: Resolve address
        }else if(ipRegex.test(this.state.address)) // Is IP. 
            // Remove protocol from IP if neccessary
            ip = this.state.address.replace(urlProtocolRegex, '');            
        return ip;
    };
    
    handleSearch = e => {
        let ip = this.validateInput();
        if(ip)
            this.reportIpLocation(ip);
        
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