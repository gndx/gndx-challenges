import React, { Component } from 'react';
import L from 'leaflet';
import { mapboxAPIAccessToken } from '../utils/credentials.js';

class Map extends Component {
    componentDidMount() {
        var map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: mapboxAPIAccessToken
        }).addTo(map);
    };

    render() {
        return(
            <div id="map" style={{height: '400px'}}></div>
        );
    };
}

export default Map;