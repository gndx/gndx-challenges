import React from 'react'

// statics
import Moon from '../../images/moon.png'
import './Error.css'

const Error = () => {
	return (
		<div className='main-404'>
			<p className='left'>4</p>

			<div className='container-moon'>
				<img className='moon' src={Moon} alt='Moon' />
			</div>

			<p className='right'>4</p>
		</div>
	)
}

export default Error
