import { makeAutoObservable, runInAction } from 'mobx'
import { db } from 'services/localDB'
import { User } from 'types'

class PersistentStore {
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

	readingInMinutes = true
	setReadingInMinutes = (_: boolean = true) => {
		this.readingInMinutes = _
		db.setLocal('readingInMinutes', _)
	}

	keyboardAutoFocusEnabled = true
	setKeyboardAutoFocusEnabled = (_: boolean) => {
		this.keyboardAutoFocusEnabled = _
		db.setLocal('keyboardAutoFocus', _)
	}

	favoriteIDs = new Set<string>()
	setUserFavorite = async (userID: string, favorite: boolean) => {
		if (favorite) this.favoriteIDs.add(userID)
		else this.favoriteIDs.delete(userID)

		db.setLocal('favorites', Array.from(this.favoriteIDs))
	}

	loadFromDisk = async () => {
		const local = await db.fetchLocalStore()

		runInAction(() => {
			this.wakeUpEnabled = local.wakeUpEnabled ?? true
			this.serviceEnabled = local.serviceEnabled ?? true
			this.yogaEnabled = local.yogaEnabled ?? true
			this.lectionsEnabled = local.lectionsEnabled ?? true
			this.bedEnabled = local.bedEnabled ?? true
			this.readingInMinutes = local.readingInMinutes ?? false
			this.keyboardAutoFocusEnabled = local.keyboardAutoFocus ?? true
			if (local.favorites) this.favoriteIDs = new Set(this.favoriteIDs)
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

export const persistentStore = new PersistentStore()
