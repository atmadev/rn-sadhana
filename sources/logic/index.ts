import * as SplashScreen from 'expo-splash-screen'
import { initLocalDB } from 'services/localDB'
import { store } from 'store'
import { LoginScreen } from 'screens/LoginScreen'
import { fetchSecure } from 'services/secureStore'
import { login } from './auth'
import * as vs from 'services/network/vs'
import { MyGraphScreen } from 'screens/graph/MyScreen'
import { FALSE } from 'shared/types/primitives'
import { myGraphStore } from 'store/MyGraphStore'
import * as db from 'services/localDB'

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
		const [username, password] = await Promise.all([
			fetchSecure('username'),
			fetchSecure('password'),
		])

		if (username && password) {
			const result = await login(username, password)

			if (result.success === true) {
				await fetchInitialData()
				MyGraphScreen.navigate()
				return
			}
		}

		LoginScreen.navigate()
	} catch (e) {
		LoginScreen.navigate()
	}
}

export const fetchInitialData = async () => {
	const myResult = await vs.me()
	if (myResult.success === false) {
		return { success: FALSE, message: myResult.error.message }
	}

	const me = myResult.data
	await db.insertUsers(me)

	const entriesResult = await vs.entries(me.userid, {})

	if (entriesResult.success === false) {
		return { success: FALSE, message: "Can't load entries" }
	}

	const { entries } = entriesResult.data
	await db.insertEntries(entries)

	const allEntries = await db.entries(me.userid)
	myGraphStore.setEntries(allEntries)
}
