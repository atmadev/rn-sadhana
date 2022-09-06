import * as vs from 'services/network/vs'
import { FALSE } from 'shared/types/primitives'
import { saveSecure } from 'services/secureStore'
import { userStore } from 'store/UserStore'
import * as db from 'services/localDB'
import { fetchMyRecentEntries } from './entries'

export const login = async (username: string, password: string) => {
	try {
		const result = await vs.login(username, password)
		if (result.success === false) {
			return { success: FALSE, message: result.error.message }
		}

		saveSecure('username', username)
		saveSecure('password', password)

		return await fetchInitialData()
	} catch (e) {
		console.log('logic/login error', e)
		return { success: FALSE, message: 'Please, try again' }
	}
}

export const fetchInitialData = async () => {
	try {
		const myResult = await vs.me()
		if (myResult.success === false) {
			return { success: FALSE, message: myResult.error.message }
		}

		const me = myResult.data
		userStore.setMe(me)
		await db.insertUsers(me)
		await db.setValueToLocalStore('myID', me.userid)

		const success = await fetchMyRecentEntries()

		if (success) return { success }
		else return { success, message: "Can't load entries" }
	} catch (e) {
		console.log('fetchInitialData', e)
		// TODO: handle exceptions / errors
		// @ts-ignore
		return { success: FALSE, message: e.message }
	}
}
