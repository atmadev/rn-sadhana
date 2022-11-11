import { YMD } from './types'
import { pad } from './utils'

export const isTheSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

export const ymdStringFromDate = (date: Date = new Date()): YMD => {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`
}

export const utcYmdStringFromDate = (date: Date = new Date()): YMD => {
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}`
}

export const stringFromDate = (date: Date = new Date()) => {
	return `${ymdStringFromDate(date)} ${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
		date.getSeconds(),
		2,
	)}`
}

export const utcStringFromDate = (date = new Date()) => {
	return `${utcYmdStringFromDate(date)} ${pad(date.getUTCHours(), 2)}:${pad(
		date.getUTCMinutes(),
		2,
	)}:${pad(date.getUTCSeconds(), 2)}`
}

export const monthStringFromDate = (date = new Date()) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}`

export const SECOND_MS = 1000
export const MINUTE_MS = 60 * SECOND_MS
export const HOUR_MS = 60 * MINUTE_MS
export const DAY_MS = 24 * HOUR_MS
export const MONTH_MS = 30 * DAY_MS
