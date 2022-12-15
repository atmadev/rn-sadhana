import { makeAutoObservable, runInAction } from 'mobx'
import { db } from 'services/localDB'
import { User } from 'types'
import { persistentStore } from './PersistentStore'

class UserStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, User>()
	get array() {
		return Array.from(this.map.values())
	}

	get favorites() {
		return this.array.filter((u) => persistentStore.favoriteIDs.has(u.userid))
	}

	myID: string | null = null
	setMyID = (ID: string | null) => (this.myID = ID)

	get me() {
		return this.myID ? this.map.get(this.myID) : null
	}

	setMe = (me: User) => {
		this.setUser(me)
		this.myID = me.userid
	}

	updateMe = (me: Partial<User>) => {
		if (!this.me) return
		this.setMe({ ...this.me, ...me })
	}

	setUser = (user: User) => {
		this.map.set(user.userid, user)
		db.insertUsers(user)
	}

	loadFromDisk = async () => {
		const users = await db.fetchUsers()
		runInAction(() => {
			users.forEach((u) => this.map.set(u.userid, u))
		})
	}

	clear = () => {
		this.map.clear()
		this.myID = null
	}
}

export const userStore = new UserStore()
