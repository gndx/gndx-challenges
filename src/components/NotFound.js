import React from 'react'
import logo from '../assets/404.gif'

const NotFound = () =>
  <div style={{
    padding: 50,
    height: '100vh',
    background: '#aff1e4'
  }}>
    <img src={logo} style={{ width: 600, padding: 10 }} alt="404" />
    <h1>Don't worry, this isn't what you were looking for, is it?</h1>
  </div>

export default NotFound