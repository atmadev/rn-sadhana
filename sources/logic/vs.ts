import { VSResponse } from 'services/network'
import * as vs from 'services/network/vs'
import { fetchSecure } from 'services/secureStore'
import { isNetworkError } from 'utils'

export const vsRunSafe = async <T>(method: () => Promise<VSResponse<T>>) => {
	try {
		const result = await method()

		if (result.success === false) {
			if (result.error.name === 'json_not_logged_in' || result.error.name === 'rest_forbidden') {
				// RE-LOGIN
				const [username, password] = await Promise.all([
					fetchSecure('username'),
					fetchSecure('password'),
				])
				if (username && password) {
					const loginResult = await vs.login(username, password)
					if (loginResult.success) return method()
					else {
						const error = new Error('Password is not valid any more')
						error.name = 'InvalidPassword'
						throw error
					}
				}
			}
		}

		return result
	} catch (e) {
		if (isNetworkError(e)) {
			// TODO: show offline label
		}
		throw e
	}
}
