import React, { Component, createRef } from 'react';
import { geoIpifyAPIKey, geoIpifyAPIUrl } from '../utils/credentials.js';
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

    // The ipify API is returning a empty response when request is made outside localhost
    reportIpLocation = async ip => {
        // await axios.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat')
        await axios.get(`${geoIpifyAPIUrl}?apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`)
        .then(res => {
            console.log(res.data)
            if(typeof res.data === 'object' || res.data instanceof Object)
                addressService.notify(res.data);
        })
    };
    
    validateAndSubmit = async () => {
        if(urlRegex.test(this.state.address)) { // Is url
            await axios.get(`https://dns.google/resolve?name=${this.state.address}`)
            .then(res => {
                for(let i in res.data.Answer){
                    if(res.data.Answer[i].type === 1) {
                        this.reportIpLocation(res.data.Answer[i].data);
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