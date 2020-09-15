import React from 'react'

// statics
import './App.css'

// components
import Error from './components/error/Error'
import Info from './components/info/Info'
import Astronaut from './components/astronaut/Astronaut'
import ContainerStar from './components/containerStar/ContainerStar'

function App() {
	return (
		<main className='space'>
			<Error />
			<Info />
			<Astronaut />
			<ContainerStar />
		</main>
	)
}

export default App
