const logStyle = {
	bold: '1',
	grey: '2',
	italic: '3',
	red: '31',
	green: '32',
	yellow: '33',
}

export const styleLog = (style: keyof typeof logStyle, string: string) =>
	`\x1b[${logStyle[style]}m${string}\x1b[0m`

// @ts-ignore
type OnlyValueTypes<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] }
type OnlyStrings<T> = OnlyValueTypes<T, string>

/**
 * @description converts array to the record, using specified property as a key
 * @example you have array of users, and you can convert it to the { userId: user } record
 *
 * @param array which you want convert to the record, for example array of users
 * @param key of unique identifier of each object, for example `userId`
 * @returns record, where key is unique identifier of each object, value is object from array, for example { userId: user } record
 */
export const recordFromArray = <T, K extends keyof OnlyStrings<T>>(array: T[], key: K) => {
	const map = {} as { [key: string]: T }
	array.forEach((object) => {
		// @ts-ignore
		const id = object[key]
		// @ts-ignore
		map[id] = object
	})
	return map
}

export const pad = (number: number, width: number) => {
	const numberString = number.toString()
	return numberString.length >= width
		? numberString
		: new Array(width - numberString.length + 1).join('0') + numberString
}

export const trimmed = (string?: string | null) => {
	if (!string) return null
	const trimmed = string.trim()
	return trimmed.length > 0 ? trimmed : null
}

export const validateEmail = (text: string) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(text).toLowerCase())
}
