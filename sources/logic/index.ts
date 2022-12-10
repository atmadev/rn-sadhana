import * as SplashScreen from 'expo-splash-screen'
import { db } from 'services/localDB'
import { store } from 'store'
import { deleteSecure, fetchSecure } from 'services/secureStore'
import { fetchInitialData, login } from './auth'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'
import { isNetworkError } from 'utils'
import { InteractionManager } from 'react-native'
import { loginStore } from 'store/LoginStore'
import { fetchLocalEntries, sendEntries } from './entries'
import { navigate, reset, resetToMyGraph } from 'navigation'
import { settingsStore } from 'store/SettingsStore'
import { profileStore } from 'store/ProfileStore'

// TODO: think about offline mode
// TODO: think how to show the my graph ASAP

SplashScreen.preventAutoHideAsync()

export const initApp = async () => {
	try {
		await db.init()
		await Promise.all([
			userStore.loadFromDisk(),
			profileStore.loadFromDisk(),
			settingsStore.loadFromDisk(),
		])
		store.setInited()
	} catch (e) {
		// TODO: capture exception on sentry
		// We might want to provide this error information to an error reporting service
		console.warn(e)
	}
}

export const onAppStart = async () => {
	try {
		const [username, password, myID] = await Promise.all([
			fetchSecure('username'),
			fetchSecure('password'),
			db.getLocal('myID'),
		])

		if (username && password && myID) {
			userStore.setMyID(myID)
			profileStore.setMyID(myID)

			// Prefetch only local entries from the DB
			try {
				await fetchLocalEntries()
			} catch (e) {}
			resetToMyGraph()

			SplashScreen.hideAsync()
			try {
				const result = await login(username, password)

				if (result.success !== true) {
					// TODO: log logout reason to the sentry
					throw new Error(result.message)
				}

				await fetchInitialData()
				await sendEntries()
			} catch (e) {
				if (isNetworkError(e)) return
				throw e
			}
		} else {
			SplashScreen.hideAsync()
			navigate('Login')
		}
	} catch (e) {
		SplashScreen.hideAsync()
		navigate('Login')
	}
}

export const signOut = async () => {
	reset('Login')
	InteractionManager.runAfterInteractions(async () => {
		await Promise.all([deleteSecure('username'), deleteSecure('password'), db.removeLocal('myID')])
		userStore.clear()
		graphStore.clear()
		loginStore.clear()
		store.clear()
	})
}
