export const STUDENT_NATIONAL = 'COSTARRICENSE'

export const capitalize = (s: string) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const formatoOracion = text => {
	// Trim to remove any leading or trailing whitespace
	text = text.trim()

	// Use a regular expression to capitalize first letter of each sentence
	return text.replace(/(?:^|\.\s+)([a-z])/g, (match, firstLetter) => {
		return match.toUpperCase()
	})
}

export const generarClave = (type, length) => {
	let characters = ''
	switch (type) {
		case 'num':
			characters = '0123456789'
			break
		case 'alf':
			characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
			break
		case 'rand':
			// FOR ↓
			break
		default:
			characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
			break
	}
	let pass = ''
	for (let i = 0; i < length; i++) {
		if (type == 'rand') {
			pass += String.fromCharCode((Math.floor(Math.random() * 100) % 94) + 33)
		} else {
			pass += characters.charAt(Math.floor(Math.random() * characters.length))
		}
	}
	return pass
}

// Se utiliza para generar clave de cuenta de Office 365
export const generatePassword = () => {
	function Next(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function MakePassword(characters) {
		for (let i = characters.length - 1; i > 0; i--) {
			const rand = Math.floor(Math.random() * (i + 1))
			;[characters[i], characters[rand]] = [characters[rand], characters[i]]
		}
		return characters.join('')
	}

	const letras = 'abcdefghijklmnopqrstuvwxyz'
	const numeros = '1234567890'
	const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const cc = 4
	const cn = 3
	const ce = 1

	let password = ''

	for (let i = 0; i < cc; i++) {
		const c = letras[Next(0, letras.length - 1)]
		password += c
	}

	for (let i = 0; i < cn; i++) {
		const ccc = numeros[Next(0, numeros.length - 1)]
		password += ccc
	}

	for (let i = 0; i < ce; i++) {
		const cccc = mayusculas[Next(0, mayusculas.length - 1)]
		password += cccc
	}

	password = MakePassword([...password])

	return password
}

// validar si lo ingresado es un número, a través del onKeyPress
export const onlyNumbers = e => {
	//
	return typeof e.key === 'number'
}
