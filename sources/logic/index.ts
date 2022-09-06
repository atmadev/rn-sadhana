import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB } from 'services/localDB'
import { store } from 'store'
import { LoginScreen } from 'screens/LoginScreen'
import { fetchSecure } from 'services/secureStore'
import { login } from './auth'
import * as db from 'services/localDB'
import { graphStore } from 'store/GraphStore'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { userStore } from 'store/UserStore'

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
			const localEntries = await db.entries(myID)
			graphStore.setEntries(localEntries, myID)
			MyGraphScreen.navigate()

			const result = await login(username, password)
			// TODO: check network error. Don't logout user on network error. Only on Invalid Credentials
			if (result.success === true) return
		}

		LoginScreen.navigate()
	} catch (e) {
		LoginScreen.navigate()
	}
}
