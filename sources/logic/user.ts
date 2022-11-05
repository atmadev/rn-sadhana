import * as vs from 'services/network/vs'
import { settingsStore } from 'store/SettingsStore'
import { userStore } from 'store/UserStore'

export const updateOptions = async () => {
	try {
		const result = await vs.updateOptions({
			userid: userStore.myID!,
			opt_wake: settingsStore.wakeUpEnabled,
			opt_service: settingsStore.serviceEnabled,
			opt_exercise: settingsStore.yogaEnabled,
			opt_lections: settingsStore.lectionsEnabled,
			opt_sleep: settingsStore.bedEnabled,
		})
		console.log('update options result', result)
	} catch (e) {
		// TODO: caption error on sentry
		console.log('update options error', e)
	}
}
