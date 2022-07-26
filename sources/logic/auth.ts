import * as vs from 'services/network/vs'
import { FALSE, TRUE } from 'shared/types/primitives'
import { LoginScreen } from 'screens/LoginScreen'
import { store } from 'store'

export const onAppStart = async () => {
	try {
		if (!store.tokens) {
			LoginScreen.navigate()
			return
		}

		const success = await vs.refreshTokens()
		if (success) {
			// TODO: show sadhana
		} else {
			LoginScreen.navigate()
		}
	} catch (e) {
		LoginScreen.navigate()
	}
}

export const login = async (username: string, password: string) => {
	try {
		const result = await vs.login(username, password)
		if (result.success === false) {
			return { success: FALSE, message: result.error.message }
		}

		store.setTokens(result.data)

		// TODO: load sadhana

		return { success: TRUE }
	} catch (e) {
		console.log('logic/login error', e)
		return { success: FALSE, message: 'Please, try again' }
	}
}
