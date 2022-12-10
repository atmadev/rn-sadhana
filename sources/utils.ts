import { Alert } from 'react-native'
import { Entry, OtherGraphItem, User } from 'shared/types'
import { trimmed } from 'shared/utils'

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
