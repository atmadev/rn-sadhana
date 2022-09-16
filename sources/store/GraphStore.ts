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
		if (!userStore.myID) return null
		if (!this.map.has(userStore.myID)) {
			this.setEntries([], userStore.myID)
		}

		return this.map.get(userStore.myID)
	}

	setEntries = (entries: Entry[], userID: string) => {
		const graph = this.map.get(userID) ?? new MXGraph(userID)
		graph.setEntries(entries)
		this.map.set(userID, graph)
	}

	clear = () => {
		this.map.clear()
	}
}

export const graphStore = new GraphStore()
