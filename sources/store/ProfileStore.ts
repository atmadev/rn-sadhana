import { makeAutoObservable } from 'mobx'
import { db } from 'services/localDB'
import { Profile } from 'types'

class ProfileStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, Profile>()

	myID: string | null = null
	setMyID = (ID: string | null) => (this.myID = ID)

	get me() {
		return this.myID ? this.map.get(this.myID) : null
	}

	setMe = (me: Profile) => {
		this.setProfile(me)
		this.myID = me.userid
	}

	setProfile = (profile: Profile) => {
		this.map.set(profile.userid, profile)
		db.insertProfile(profile)
	}

	loadFromDisk = async () => {
		const profiles = await db.fetchProfiles()
		profiles.forEach((p) => this.map.set(p.userid, p))
	}

	clear = () => {
		this.map.clear()
		this.myID = null
	}
}

export const profileStore = new ProfileStore()
