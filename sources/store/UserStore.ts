import { makeAutoObservable } from 'mobx'
import { User } from 'shared/types'

class UserStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, User>()

	myID: string | null = null
	setMyID = (ID: string | null) => (this.myID = ID)

	get me() {
		return this.myID ? this.map.get(this.myID) : null
	}

	setMe = (me: User) => {
		this.setUser(me)
		this.myID = me.userid
	}

	setUser = (user: User) => {
		this.map.set(user.userid, user)
	}
}

export const userStore = new UserStore()
