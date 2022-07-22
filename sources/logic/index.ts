import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB, setObjectToLocalStore } from 'services/localDB'
import { store } from 'store'
import * as vs from 'services/network/vs'
import { FALSE, TRUE } from 'shared/types/primitives'

export const initApp = async () => {
	try {
		SplashScreen.preventAutoHideAsync()

		// Load fonts
		await Promise.all([initLocalDB()])

		store.setInited()
	} catch (e) {
		// We might want to provide this error information to an error reporting service
		console.warn(e)
	} finally {
		SplashScreen.hideAsync()
	}
}

export const login = async (username: string, password: string) => {
	const result = await vs.login(username, password)
	if (result.success) {
		setObjectToLocalStore('tokens', result.data)
		return { success: TRUE }
	}

	return { success: FALSE, message: result.error.message }
}
