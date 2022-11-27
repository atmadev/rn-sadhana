import { makeAutoObservable, runInAction } from 'mobx'
import {
	fetchUsers,
	getObjectFromLocalStore,
	insertUsers,
	setObjectToLocalStore,
} from 'services/localDB'
import { User } from 'shared/types'

class UserStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, User>()
	get array() {
		return Array.from(this.map.values())
	}

	get favorites() {
		return this.array.filter((u) => this.favoriteIDs.has(u.userid))
	}

	setUserFavorite = async (userID: string, favorite: boolean) => {
		if (favorite) this.favoriteIDs.add(userID)
		else this.favoriteIDs.delete(userID)

		setObjectToLocalStore('favorites', Array.from(this.favoriteIDs))
	}

	favoriteIDs = new Set<string>()

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
		insertUsers(user)
	}

	loadFromDisk = async () => {
		const [users, favoriteIDs] = await Promise.all([
			fetchUsers(),
			getObjectFromLocalStore('favorites'),
		])
		runInAction(() => {
			users.forEach((u) => this.map.set(u.userid, u))
			if (favoriteIDs) favoriteIDs.forEach((_) => this.favoriteIDs.add(_))
		})
	}

	clear = () => {
		this.map.clear()
		this.myID = null
	}
}

export const userStore = new UserStore()
