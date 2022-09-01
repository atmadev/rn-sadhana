import * as vs from 'services/network/vs'
import { FALSE, TRUE } from 'shared/types/primitives'
import { saveSecure } from 'services/secureStore'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { fetchInitialData } from 'logic'

export const login = async (username: string, password: string) => {
	try {
		const result = await vs.login(username, password)
		if (result.success === false) {
			return { success: FALSE, message: result.error.message }
		}

		saveSecure('username', username)
		saveSecure('password', password)

		await fetchInitialData()
		MyGraphScreen.navigate()

		return { success: TRUE }
	} catch (e) {
		console.log('logic/login error', e)
		return { success: FALSE, message: 'Please, try again' }
	}
}
