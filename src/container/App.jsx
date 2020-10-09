import React from 'react'
import Header from '../components/Header'
import Container from '../components/Container'
import Footer from '../components/Footer'
import '../styles/global.css'

const App = () => {
    return (
        <React.Fragment>
            <Header />
            <Container />
            <Footer />
        </React.Fragment>
    )
}

export default App;