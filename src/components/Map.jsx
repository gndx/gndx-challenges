import React, { Component } from 'react';
import L from 'leaflet';
import { mapboxAPIAccessToken } from '../utils/credentials.js';
import addressService from '../utils/addressService.js';

class Map extends Component {

    // Map is defined here so that it can be destroyed on unmount
    map;
    
    componentDidMount() {
        this.map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: mapboxAPIAccessToken
        }).addTo(this.map);
        
        addressService.suscribe('map', mapData => {
            let newPos = L.latLng(mapData.location.lat, mapData.location.lng);
            this.map.setView(newPos, this.map.getZoom());
        });
    };
    
    componentWillUnmount() {
        this.map.remove();
        addressService.unsuscribe('map');
    }

    // TODO: make map containter height adjustable to screen size
    render() {
        return(
            <div id="map" style={{height: '400px'}}></div>
        );
    };
}

export default new Map();