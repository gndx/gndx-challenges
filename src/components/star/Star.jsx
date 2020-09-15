import React, { useState, useEffect } from 'react'

// statics
import './Star.css'

const Star = () => {
	const [starCss, seteStarCss] = useState({
		left: '50%',
		top: 'calc(100% + 300px)',
		width: '3px',
		height: '2px',
		animationDuration: '5s',
		animationDelay: '2s',
	})

	const changePos = () => {
		let x = Math.floor(Math.random() * window.innerWidth)
		let y = Math.floor(Math.random() * window.innerHeight)
		let duration = Math.random() * 10
		let size = Math.random() * 2

		let left = x + 'px'
		let top = y + 'px'
		let width = 1 + size + 'px'
		let height = 1 + size + 'px'
		let animationDuration = 5 + duration + 's'
		let animationDelay = size + 's'

		seteStarCss({ left, top, width, height, animationDuration, animationDelay })
	}

	useEffect(
		() => {
			/* const updateSize = () => {
			const witdh = window.innerWidth
			const height = window.innerHeight

			setWidth(witdh)
			setHeight(height)
		}

		window.addEventListener('resize', updateSize) */

			/* changePos(witdh, height) */
			changePos()
		},
		[
			/* witdh, height */
		]
	)

	return <i style={starCss}></i>
}

export default Star
