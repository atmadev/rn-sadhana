import { Alert } from 'react-native'
import { Entry, OtherGraphItem, User } from 'types'
import { format } from 'date-fns'
import * as locales from 'date-fns/locale'
import { getLocales } from 'expo-localization'

const deviceLanguage = getLocales()[0]
// @ts-ignore
const locale = locales[deviceLanguage.languageCode]

export const isNetworkError = (e: any) => {
	const message = inferErrorMessage(e)

	if (message) {
		const lowMessage = message.toLowerCase()
		if (lowMessage.includes('network') || lowMessage.includes('internet')) return true
	}

	return false
}

export const inferErrorMessage = (error: any): string | null => {
	if (!error) return null
	if (typeof error === 'string') return error
	if (Array.isArray(error)) return inferErrorMessage(error[0])
	if ('message' in error && error.message) return error.message
	return null
}

export const showError = (e: any) =>
	Alert.alert('Error', inferErrorMessage(e) ?? '', [{ text: 'OK' }], { cancelable: true })

export const userName = (user: User) => trimmed(user.user_name) ?? trimmed(user.user_nicename) ?? ''

export const graphItemName = (item: OtherGraphItem) =>
	trimmed(item.spiritual_name) ?? trimmed(item.karmic_name) ?? trimmed(item.user_nicename)

export const defaultMaxRounds = 17

export const parseRounds = (entry?: Entry, maxRounds = defaultMaxRounds) => {
	const before730 = entry?.jcount_730 ? parseInt(entry?.jcount_730) : 0
	const before10 = entry?.jcount_1000 ? parseInt(entry?.jcount_1000) : 0
	const before18 = entry?.jcount_1800 ? parseInt(entry?.jcount_1800) : 0
	const after = entry?.jcount_after ? parseInt(entry?.jcount_after) : 0
	const all = before730 + before10 + before18 + after
	return {
		before730,
		before10,
		before18,
		after,
		all,
		left: Math.max(maxRounds - all, 0),
	}
}

export const formatLocal = (date: Date | string, formatter: string) => {
	if (date === undefined) return 'undefined'
	return format(typeof date === 'string' ? new Date(date) : date, formatter, { locale })
}

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

export const getLast = <T>(a: T[]) => (a.length > 0 ? a[a.length - 1] : undefined)
export const removeElement = <T>(array: T[], element: T) => {
	const index = array.indexOf(element)
	if (index >= 0) array.splice(index, 1)
}
export const capitalized = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const pick = <O, K extends keyof O>(object: O, ...keys: K[]) => {
	const result = {} as Pick<O, K>
	keys.forEach((k) => (result[k] = object[k]))
	return result
}

export const hash = function (str: string, seed = 0) {
	let h1 = 0xdeadbeef ^ seed
	let h2 = 0x41c6ce57 ^ seed

	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i)
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677)
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
	return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const mapFromArray = <
	T,
	K extends keyof OnlyStrings<T>,
	V extends keyof T | undefined,
	MAP = V extends undefined ? { [key: string]: T } : { [key: string]: T[Exclude<V, undefined>] },
>(
	array: T[],
	key: K,
	value: V,
) => {
	const map = {} as MAP

	array.forEach((object) => {
		// @ts-ignore
		const id = object[key]
		// @ts-ignore
		map[id] = value ? object[value] : object
	})
	return map
}

export const sleep = (seconds: number) =>
	new Promise((resolve) => setTimeout(resolve, seconds * 1000))
