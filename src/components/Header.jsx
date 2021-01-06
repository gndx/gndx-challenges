import React, { useState } from 'react';
import '../static/css/header.css'
import { geoIpifyAPIKey, geoIpifyAPIUrl } from '../utils/credentials.js';

const Header = () => {
    const [address, changeAddress] = useState('');

    const getIP = () => {
        let ip;
        const dns = require('dns');
        dns.resolve4('https://' + address, (err, addresses) => {
            if(err){
                console.log(err);
                return;
            }

            ip = (typeof addresses === 'string' || addresses instanceof String) ?
                addresses : addresses[0];
        });
        return ip;
    }

    const handleSearch = e => {
        e.preventDefault();
        e.stopPropagation();
        
        let ip = getIP(); 
        if(ip){
            let http = require('http');
            http.get(`${geoIpifyAPIUrl}apiKey=${geoIpifyAPIKey}&ipAddress=${ip}`, res => {
                let rawData = '';
                res.on('data', chunk => rawData += chunk);
                res.on('end', () => {
                    console.log(rawData);
                });
            }).end();
        }

        changeAddress('');
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