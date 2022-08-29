import { pad } from './utils'

export const monthFromDate = (date: string) => {
	// TODO: check it.
	// not needed yet
	return date.split(' ')[1]
}

export const isTheSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

export const utcDateStringFromDate = (date: Date) => {
	return `${date.getFullYear()}-${pad(date.getMonth(), 2)}-${pad(date.getDate(), 2)}`
}

export const timeStringFromDate = (date: Date) => {
	return `${date.getFullYear()}-${pad(date.getMonth(), 2)}-${pad(date.getDate(), 2)} ${pad(
		date.getHours(),
		2,
	)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`
}

export const utcTimeStringFromDate = (date: Date) => {
	return `${utcDateStringFromDate(date)} ${pad(date.getUTCHours(), 2)}:${pad(
		date.getUTCMinutes(),
		2,
	)}:${pad(date.getUTCSeconds(), 2)}`
}
