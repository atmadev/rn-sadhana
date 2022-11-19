import * as vs from 'services/network/vs'
import { FALSE, TRUE } from 'shared/types/primitives'
import { saveSecure } from 'services/secureStore'
import { userStore } from 'store/UserStore'
import * as db from 'services/localDB'
import { fetchMyRecentEntries } from './entries'
import { loginStore } from 'store/LoginStore'
import { settingsStore } from 'store/SettingsStore'
import { clearRegistrationStore, registrationStore } from 'store/RegistrationStore'
import { InteractionManager } from 'react-native'
import { resetToMyGraph } from 'navigation'
import { validateEmail } from 'shared/utils'
import { showError } from 'utils'
import { profileStore } from 'store/ProfileStore'

// TODO: don't logout on network error

export const login = async (username: string, password: string) => {
	try {
		const result = await vs.login(username, password)
		if (result.success === false) {
			return { success: FALSE, message: result.error.message }
		}

		saveSecure('username', username)
		saveSecure('password', password)

		return { success: TRUE }
	} catch (e) {
		console.log('logic/login error', e)
		return { success: FALSE, message: 'Please, try again' }
	}
}

export const fetchInitialData = async () => {
	try {
		loginStore.setStatus('Success!')
		const myResult = await vs.me()
		if (myResult.success === false) return { success: FALSE, message: myResult.error.message }

		const me = myResult.data
		loginStore.setStatus(`Hey, ${me.user_name ?? 'user'}! Downloading your sadhana...`)

		userStore.setMe(me)
		settingsStore.mapFromUser(me)
		await db.setValueToLocalStore('myID', me.userid)

		const profileResult = await vs.profile(me.userid)
		if (!profileResult.success) return { success: FALSE, message: profileResult.error.message }
		profileStore.setMe(profileResult.data)

		const success = await fetchMyRecentEntries()

		if (success) return { success: TRUE }
		else return { success: FALSE, message: "Can't load entries" }
	} catch (e) {
		console.log('fetchInitialData', e)
		// TODO: handle exceptions / errors
		// TODO: handle auth error
		// @ts-ignore
		return { success: FALSE, message: e.message }
	}
}

export const register = async () => {
	if (!validateEmail(registrationStore.email)) {
		showError("Email isn't valid")
		return
	}

	if (registrationStore.password !== registrationStore.confirmPassword) {
		showError('Passwords are different')
		return
	}

	try {
		registrationStore.setLoading(true)
		const data = {
			spiritual_name: registrationStore.spiritualName,
			first_name: registrationStore.firstName,
			last_name: registrationStore.lastName,
			email: registrationStore.email,
			password: registrationStore.password,
		}
		console.log(data)
		const result = await vs.register(data)
		console.log({ result })

		if (!result.success) {
			// TODO: show error
			showError(result.error)
			return
		}

		// TODO: login with user id
		const loginResult = await login(registrationStore.email, registrationStore.password)
		console.log({ loginResult })

		if (!loginResult.success) {
			// TODO: handle error
			showError(loginResult.message)
			return
		}

		const initialDataResult = await fetchInitialData()
		console.log({ initialDataResult })

		if (!initialDataResult.success) {
			// TODO: handle error
			showError(initialDataResult.message)
			return
		}

		resetToMyGraph()

		InteractionManager.runAfterInteractions(clearRegistrationStore)
	} catch (e) {
		// TODO: show error, capture exception
		showError(e)
	} finally {
		registrationStore.setLoading(false)
	}
}
