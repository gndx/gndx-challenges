import React, { Component } from 'react';
import { mapboxAPIAccessToken } from '../utils/credentials.js';
import addressService from '../utils/addressService.js';
import L from 'leaflet';

// leaflet icon assets
import icon from '../static/images/icon-location.svg';
import shadow from  '../static/images/icon-location.svg';

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            id: 'map',
            height: 0,
            // init marker with custom icon
            marker: L.marker([51.505, -0.09], {
                icon: L.icon({
                    iconUrl: icon,
                    iconSize:   [46, 56],
                    iconAnchor: [23, 56],
                    shadowUrl: shadow,
                    shadowSize:   [11, 14],
                    shadowAnchor: [5.5, 14]
                })
            })
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

        // add marker to map
        this.state.marker.addTo(this.map);

        // remove zoom control from mobile
        if (L.Browser.mobile) 
            this.map.removeControl(this.map.zoomControl);
        
        addressService.suscribe(this.state.id, mapData => {
            let newPos = L.latLng(mapData.location.latitude, mapData.location.longitude);
            // update view
            this.map.setView(newPos, this.map.getZoom());
            // update marker
            this.state.marker.setLatLng(newPos);
        });

        this.setState({
            height: addressService.consumeHeight()
        })
    };
    
    componentWillUnmount() {
        this.map.remove();
        addressService.unsuscribe(this.state.id);
    }

    render() {
        return(
            <div id={this.state.id} style={{height: window.innerHeight - this.state.height }}></div>
        );
    };
}

export default Map;