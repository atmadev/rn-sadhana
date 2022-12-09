import { makeAutoObservable, runInAction } from 'mobx'
import { db } from 'services/localDB'
import { User } from 'shared/types'

class SettingsStore {
	constructor() {
		makeAutoObservable(this)
	}

	wakeUpEnabled = true
	setWakeUpEnabled = (e: boolean = true) => {
		this.wakeUpEnabled = e
		db.setLocal('wakeUpEnabled', e)
	}

	serviceEnabled = true
	setServiceEnabled = (e: boolean = true) => {
		this.serviceEnabled = e
		db.setLocal('serviceEnabled', e)
	}

	yogaEnabled = true
	setYogaEnabled = (e: boolean = true) => {
		this.yogaEnabled = e
		db.setLocal('yogaEnabled', e)
	}

	lectionsEnabled = true
	setLectionsEnabled = (e: boolean = true) => {
		this.lectionsEnabled = e
		db.setLocal('lectionsEnabled', e)
	}

	bedEnabled = true
	setBedEnabled = (e: boolean = true) => {
		this.bedEnabled = e
		db.setLocal('bedEnabled', e)
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
		const props = await db.getLocals(
			'wakeUpEnabled',
			'serviceEnabled',
			'yogaEnabled',
			'lectionsEnabled',
			'bedEnabled',
		)

		runInAction(() => {
			this.wakeUpEnabled = props.wakeUpEnabled ?? true
			this.serviceEnabled = props.serviceEnabled ?? true
			this.yogaEnabled = props.yogaEnabled ?? true
			this.lectionsEnabled = props.lectionsEnabled ?? true
			this.bedEnabled = props.bedEnabled ?? true
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
