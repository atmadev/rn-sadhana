import * as vs from 'services/network/vs'
import { persistentStore } from 'store/PersistentStore'
import { userStore } from 'store/UserStore'

export const updateOptions = async () => {
	try {
		await vs.updateOptions({
			userid: userStore.myID!,
			opt_wake: persistentStore.wakeUpEnabled,
			opt_service: persistentStore.serviceEnabled,
			opt_exercise: persistentStore.yogaEnabled,
			opt_lections: persistentStore.lectionsEnabled,
			opt_sleep: persistentStore.bedEnabled,
		})
		// console.log('update options result', result)
	} catch (e) {
		// TODO: caption error on sentry
		console.log('update options error', e)
	}
}
