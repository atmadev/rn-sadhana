import { makeAutoObservable, runInAction } from 'mobx'
import { Entry } from 'types'
import { MXGraph } from './MXGraph'
import { userStore } from './UserStore'

class GraphStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, MXGraph>()

	get my() {
		if (!userStore.myID) return null
		if (!this.map.has(userStore.myID)) {
			this.setEntries([], userStore.myID)
		}

		return this.map.get(userStore.myID)
	}

	graphForUserID = (userID: string) => {
		const graph = this.map.get(userID) ?? new MXGraph(userID)
		runInAction(() => this.map.set(userID, graph))

		return graph
	}

	get favorites() {
		return userStore.favorites.map((u) => this.graphForUserID(u.userid))
	}

	setEntries = (entries: Entry[], userID: string) => {
		const graph = this.graphForUserID(userID)
		graph.setEntries(entries)
	}

	selectedID: string | null = null
	setSelectedID = (id: string | null) => {
		this.selectedID = id
		if (id && !this.map.has(id)) this.map.set(id, new MXGraph(id))
	}

	get selected() {
		return this.selectedID ? this.map.get(this.selectedID) : null
	}

	clear = () => {
		this.map.clear()
	}
}

export const graphStore = new GraphStore()
