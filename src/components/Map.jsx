import React, { Component } from 'react';
import L from 'leaflet';
import { mapboxAPIAccessToken } from '../utils/credentials.js';
import addressService from '../utils/addressService.js';

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            id: 'map',
            height: 0        
        }
    }

    // Map is defined here so that it can be destroyed on unmount
    map;
    
    componentDidMount() {
        this.map = L.map(this.state.id).setView([51.505, -0.09], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: mapboxAPIAccessToken
        }).addTo(this.map);

        if (L.Browser.mobile) {
            this.map.removeControl(this.map.zoomControl);
         }
        
        addressService.suscribe(this.state.id, mapData => {
            let newPos = L.latLng(mapData.location.lat, mapData.location.lng);
            this.map.setView(newPos, this.map.getZoom());
            L.marker(newPos).addTo(this.map);
        });

        this.setState({
            height: addressService.consumeHeight()
        })
    };
    
    componentWillUnmount() {
        this.map.remove();
        addressService.unsuscribe(this.state.id);
    }

    // TODO: make map containter height adjustable to screen size
    render() {
        return(
            <div id={this.state.id} style={{height: window.innerHeight - this.state.height }}></div>
        );
    };
}

export default Map;