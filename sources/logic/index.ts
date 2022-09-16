import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB } from 'services/localDB'
import { store } from 'store'
import { LoginScreen } from 'screens/LoginScreen'
import { deleteSecure, fetchSecure } from 'services/secureStore'
import { login } from './auth'
import * as db from 'services/localDB'
import { graphStore } from 'store/GraphStore'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { userStore } from 'store/UserStore'
import { isNetworkError } from 'utils'
import { InteractionManager } from 'react-native'
import { loginStore } from 'store/LoginStore'

// TODO: think about offline mode
// TODO: think how to show the my graph ASAP

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

export const onAppStart = async () => {
	try {
		const [username, password, myID] = await Promise.all([
			fetchSecure('username'),
			fetchSecure('password'),
			db.getValueFromLocalStore('myID'),
		])

		if (username && password && myID) {
			userStore.setMyID(myID)
			// Prefetch only local entries from the DB
			const localEntries = await db.entries(myID)
			graphStore.setEntries(localEntries, myID)
			MyGraphScreen.navigate()

			try {
				const result = await login(username, password)

				if (result.success === true) return

				// TODO: log logout reason to the sentry
			} catch (e) {
				if (isNetworkError(e)) return
				throw e
			}
		}

		LoginScreen.navigate()
	} catch (e) {
		LoginScreen.navigate()
	}
}

export const signOut = async () => {
	LoginScreen.reset()
	InteractionManager.runAfterInteractions(async () => {
		await Promise.all([
			deleteSecure('username'),
			deleteSecure('password'),
			db.removeItemFromLocalStore('myID'),
		])
		userStore.clear()
		graphStore.clear()
		loginStore.clear()
		store.clear()
	})
}
