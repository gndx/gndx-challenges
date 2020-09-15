import React, { useState, useEffect } from 'react'

// statics
import ImgAstro from '../../images/main-astronaut.png'
import './Astronaut.css'

const Astronaut = () => {
	const [message, setMessage] = useState('')
	const [nameClass, setNameclass] = useState('container-astronaut')
	const [changePos, setChangePos] = useState({
		top: '300px',
		left: '50px',
	})

	const handleClic = () => {
		const msgs = [
			'There is nothing here.',
			'Go back home. 🏡',
			"Don'touch me. 👈",
			'You are so lost. 🎆',
		]
		const random = Math.floor(Math.random() * msgs.length) + 0
		setMessage(msgs[random])
		setNameclass('container-astronaut active')
		setTimeout(() => {
			setNameclass('container-astronaut')
		}, 3000)
	}

	const moveAstronaut = () => {
		let left = Math.floor(Math.random() * (window.innerWidth - 200))
		let top = Math.floor(Math.random() * (window.innerHeight - 200))
		setChangePos({ top, left })
	}

	useEffect(() => {
		setInterval(() => moveAstronaut(), 5000)
	}, [])

	return (
		<div className={nameClass} message={message} style={changePos}>
			<img
				className='astronaut'
				src={ImgAstro}
				alt='Astronaut'
				onClick={handleClic}
			/>
		</div>
	)
}

export default Astronaut
