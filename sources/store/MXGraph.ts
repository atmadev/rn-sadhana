import { makeAutoObservable } from 'mobx'
import { Entry, YMD } from 'shared/types'
import { MXEntry } from './MXEntry'

export class MXGraph {
	userID: string

	constructor(userID: string) {
		this.userID = userID
		makeAutoObservable(this, { userID: false })
	}

	entries = new Map<YMD, Entry>()
	setEntries = (es: Entry[]) => {
		es.forEach((e) => this.entries.set(e.date, e))
	}

	mxEntries = new Map<YMD, MXEntry>()
	getMXEntry = (ymd: YMD) => {
		if (this.mxEntries.has(ymd)) {
			return this.mxEntries.get(ymd)!
		}

		const mxEntry = new MXEntry(this.entries.get(ymd))
		this.mxEntries.set(ymd, mxEntry)

		// console.log(ymd, 'created')
		return mxEntry
	}

	clearMXEntries = () => this.mxEntries.clear()

	refreshing = false
	setRefreshing = (r: boolean) => (this.refreshing = r)
}
