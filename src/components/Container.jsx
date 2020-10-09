import React from 'react'
import Image from '../assets/static/Image.png'
import '../styles/container.css'

export default () => (
    <div className="container">
        <div className="row">
            <div className="col">
                <img className="img" src={Image} alt="Image Not Found" />
            </div>
            <div className="col">
                <h1 className="title">I have bad news for you</h1>
                <p className="paragraph">
                    The page you are looking for might be removed or is temporarily unavailable
                    </p>
                <button className="button">Back to Homepage</button>
            </div>
        </div>
    </div>
)
