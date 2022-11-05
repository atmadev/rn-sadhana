import { makeAutoObservable, runInAction } from 'mobx'
import { getValueFromLocalStore, setValueToLocalStore } from 'services/localDB'
import { User } from 'shared/types'

class SettingsStore {
	constructor() {
		makeAutoObservable(this)
	}

	wakeUpEnabled = true
	setWakeUpEnabled = (e: boolean = true) => {
		this.wakeUpEnabled = e
		setValueToLocalStore('wakeUpEnabled', e)
	}

	serviceEnabled = true
	setServiceEnabled = (e: boolean = true) => {
		this.serviceEnabled = e
		setValueToLocalStore('serviceEnabled', e)
	}

	yogaEnabled = true
	setYogaEnabled = (e: boolean = true) => {
		this.yogaEnabled = e
		setValueToLocalStore('yogaEnabled', e)
	}

	lectionsEnabled = true
	setLectionsEnabled = (e: boolean = true) => {
		this.lectionsEnabled = e
		setValueToLocalStore('lectionsEnabled', e)
	}

	bedEnabled = true
	setBedEnabled = (e: boolean = true) => {
		this.bedEnabled = e
		setValueToLocalStore('bedEnabled', e)
	}

	get enabledOptionsCount() {
		return (
			toInt(this.wakeUpEnabled) +
			toInt(this.serviceEnabled) +
			toInt(this.yogaEnabled) +
			toInt(this.lectionsEnabled) +
			toInt(this.bedEnabled)
		)
	}

	loadFromDisk = async () => {
		const props = await Promise.all([
			getValueFromLocalStore('wakeUpEnabled'),
			getValueFromLocalStore('serviceEnabled'),
			getValueFromLocalStore('yogaEnabled'),
			getValueFromLocalStore('lectionsEnabled'),
			getValueFromLocalStore('bedEnabled'),
		])

		runInAction(() => {
			this.wakeUpEnabled = props[0] ?? true
			this.serviceEnabled = props[1] ?? true
			this.yogaEnabled = props[2] ?? true
			this.lectionsEnabled = props[3] ?? true
			this.bedEnabled = props[4] ?? true
		})
	}

	mapFromUser = (user: User) => {
		this.setWakeUpEnabled(!!user.opt_wake)
		this.setServiceEnabled(!!user.opt_service)
		this.setYogaEnabled(!!user.opt_exercise)
		this.setLectionsEnabled(!!user.opt_lections)
		this.setBedEnabled(!!user.opt_sleep)
	}
}

export const settingsStore = new SettingsStore()

const toInt = (b: boolean) => (b ? 1 : 0)
