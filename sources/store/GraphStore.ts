import { makeAutoObservable } from 'mobx'
import { Entry } from 'shared/types'
import { MXGraph } from './MXGraph'
import { userStore } from './UserStore'

class GraphStore {
	constructor() {
		makeAutoObservable(this)
	}

	map = new Map<string, MXGraph>()

	get my() {
		return userStore.myID ? this.map.get(userStore.myID) ?? null : null
	}

	setEntries = (entries: Entry[], userID: string) => {
		const graph = this.map.get(userID) ?? new MXGraph(userID)
		graph.setEntries(entries)
		this.map.set(userID, graph)
	}
}

export const graphStore = new GraphStore()
