import React, { useState } from 'react';
import '../static/css/header.css'
import { geoIpifyAPIKey, geoIpifyAPIUrl } from '../utils/credentials.js';

const Header = () => {
    const [address, changeAddress] = useState('');

    const isIP = () => {
        let fragments = address.split('.');

        // IP can only have 4 octets
        if(fragments.length !== 4) 
            return false;

        for(let i = 0; i < fragments.length; i++){
            let n = parseInt(fragments[i]);
            //             not in IP octet range
            if(isNaN(n) || !(n >= 0 && n < 256)) 
                return false;
        }
        return true;
    } 

    const getIP = () => {
        let ip;
        const dns = require('dns');
        dns.resolve4(address, (err, addresses) => {
            if(err){
                console.log(err);
                return;
            }

            ip = (typeof addresses === 'string' || addresses instanceof String) ?
                addresses : addresses[0];
        });
        return ip;
    }

    const getGeoData = (ip) => {
        console.log(`IP: ${ip}`)
        let rawData = '';
        let http = require('http');
        http.get(`${geoIpifyAPIUrl}apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`, res => {
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => {
                console.log(rawData);
            });
        }).end();
        return rawData;
    }

    const handleSearch = e => {
        let ip = isIP() ? address : getIP();
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