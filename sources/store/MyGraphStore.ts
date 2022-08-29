import { makeAutoObservable } from 'mobx'
import { Entry } from 'shared/types'
import { recordFromArray } from 'shared/utils'

class MyGraphStore {
	constructor() {
		makeAutoObservable(this)
	}

	entries = new Map<string, Entry>()
	setEntries = (es: Entry[]) => {
		es.forEach((e) => this.entries.set(e.id, e))
	}

	get entriesByDate() {
		return recordFromArray(Array.from(this.entries.values()), 'date')
	}
}

export const myGraphStore = new MyGraphStore()
