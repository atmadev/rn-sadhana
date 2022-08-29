import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB } from 'services/localDB'
import { store } from 'store'
import { LoginScreen } from 'screens/LoginScreen'
import { fetchSecure } from 'services/secureStore'
import { login } from './auth'
import * as vs from 'services/network/vs'
import { MyGraphScreen } from 'screens/graph/MyScreen'

export const initApp = async () => {
	try {
		SplashScreen.preventAutoHideAsync()

		// Load fonts
		await Promise.all([initLocalDB()])
		await store.loadFromDisk()
		store.setInited()
	} catch (e) {
		// We might want to provide this error information to an error reporting service
		console.warn(e)
	} finally {
		SplashScreen.hideAsync()
	}
}

export const onAppStart = async () => {
	try {
		if (!store.tokens) {
			console.log('1')
			const [username, password] = await Promise.all([
				fetchSecure('username'),
				fetchSecure('password'),
			])

			if (username && password) {
				const result = await login(username, password)

				if (result.success === true) {
					MyGraphScreen.navigate()
					return
				}
			}

			LoginScreen.navigate()
			return
		}

		const refreshResult = await vs.refreshTokens()

		if (refreshResult.success) {
			MyGraphScreen.navigate()
		} else {
			store.setTokens(null)
			LoginScreen.navigate()
		}
	} catch (e) {
		LoginScreen.navigate()
	}
}
