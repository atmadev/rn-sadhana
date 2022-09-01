import { pad } from './utils'

export const isTheSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

export const ymdStringFromDate = (date: Date) => {
	return `${date.getFullYear()}-${pad(date.getMonth(), 2)}-${pad(date.getDate(), 2)}`
}

export const utcYmdStringFromDate = (date: Date) => {
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth(), 2)}-${pad(date.getUTCDate(), 2)}`
}

export const dateStringFromDate = (date: Date) => {
	return `${ymdStringFromDate(date)} ${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
		date.getSeconds(),
		2,
	)}`
}

export const utcDateStringFromDate = (date: Date) => {
	return `${utcYmdStringFromDate(date)} ${pad(date.getUTCHours(), 2)}:${pad(
		date.getUTCMinutes(),
		2,
	)}:${pad(date.getUTCSeconds(), 2)}`
}
