import * as vs from 'services/network/vs'
import * as db from 'services/localDB'
import { FALSE, TRUE } from 'shared/types/primitives'
import { store } from 'store'
import { saveSecure } from 'services/secureStore'
import { myGraphStore } from 'store/MyGraphStore'
import { MyGraphScreen } from 'screens/graph/MyScreen'

export const login = async (username: string, password: string) => {
	try {
		const result = await vs.login(username, password)
		if (result.success === false) {
			return { success: FALSE, message: result.error.message }
		}

		store.setTokens(result.data)
		saveSecure('username', username)
		saveSecure('password', password)

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
		myGraphStore.setEntries(entries)

		MyGraphScreen.navigate()

		return { success: TRUE }
	} catch (e) {
		console.log('logic/login error', e)
		return { success: FALSE, message: 'Please, try again' }
	}
}
