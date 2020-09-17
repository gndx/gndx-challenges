function converNumber(number) {
	let data = number.toString()
	data = data.substr(0, 2)

	return data + 'k'
}

export default converNumber
