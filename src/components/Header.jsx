/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../static/css/header.css'
import { geoIpifyAPIKey, geoIpifyAPIUrl } from '../utils/credentials.js';
import { urlProtocolRegex, urlRegex, ipRegex } from '../utils/regex-weburl.js';
import addressService from '../utils/addressService.js';

const Header = () => {
    const [address, changeAddress] = useState('');

    const getGeoData = (ip) => {
        console.log(`IP: ${ip}`)
        let http = require('http');
        http.get(`${geoIpifyAPIUrl}apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`, res => {
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => addressService.notify(JSON.parse(rawData)) );
        }).end();
    }

    const validateInput = () => {
        let ip;
        if(urlRegex.test(address)) { // Is url
            // TODO: Resolve address
        }else if(ipRegex.test(address)) // Is IP. 
            // Remove protocol from IP if neccessary
            ip = address.replace(urlProtocolRegex, '');            
        return ip;
    }

    const handleSearch = e => {
        let ip = validateInput();
        if(ip)
            getGeoData(ip);
        
        changeAddress('');
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <header>
            <div className="hero">
                <h2>IP Address Tracker</h2>
                <form id="search" onSubmit={handleSearch}>
                    <div>
                        <input type="text" 
                            placeholder="Search for any IP address or domain"
                            value={address}
                            onChange={e => changeAddress(e.target.value)}    
                        />
                        <button type="submit" form="search">&gt;</button>
                    </div>
                </form>
            </div>
        </header>
    );
}

export default Header;