import { makeAutoObservable } from 'mobx'
import { Entry } from 'shared/types'
import { recordFromArray } from 'shared/utils'

export class MXGraph {
	userID: string

	constructor(userID: string) {
		this.userID = userID
		makeAutoObservable(this, { userID: false })
	}

	entries = new Map<string, Entry>()
	setEntries = (es: Entry[]) => {
		es.forEach((e) => this.entries.set(e.id, e))
	}

	get entriesByDate() {
		return recordFromArray(Array.from(this.entries.values()), 'date')
	}
}
