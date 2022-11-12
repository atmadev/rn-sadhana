import { Alert } from 'react-native'
import { OtherGraphItem, User } from 'shared/types'
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
