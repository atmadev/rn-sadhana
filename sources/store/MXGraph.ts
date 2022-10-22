import { makeAutoObservable } from 'mobx'
import { Entry, YMD } from 'shared/types'
import { recordFromArray } from 'shared/utils'
import { MXEntry } from './MXEntry'

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

	mxEntriesByYMD = new Map<YMD, MXEntry>()
	getMXEntry = (ymd: YMD) => {
		if (this.mxEntriesByYMD.has(ymd)) return this.mxEntriesByYMD.get(ymd)!

		const mxEntry = new MXEntry(this.entriesByYMD[ymd])
		this.mxEntriesByYMD.set(ymd, mxEntry)

		return mxEntry
	}

	get entriesByYMD() {
		return recordFromArray(Array.from(this.entries.values()), 'date')
	}

	refreshing = false
	setRefreshing = (r: boolean) => (this.refreshing = r)
}
