import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB } from 'services/localDB'
import { store } from 'store'

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
