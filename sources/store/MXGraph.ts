import { makeAutoObservable } from 'mobx'
import { Entry, OtherGraphItem, YMD } from 'shared/types'
import { MXEntry } from './MXEntry'

export class MXGraph {
	userID: string

	constructor(userID: string) {
		this.userID = userID
		makeAutoObservable(this, { userID: false, item: false })
	}

	entries = new Map<YMD, Entry>()
	setEntries = (_: Entry[]) => {
		_.forEach((_) => this.entries.set(_.date, _))
	}

	mxEntries = new Map<YMD, MXEntry>()
	getMXEntry = (ymd: YMD) => {
		if (this.mxEntries.has(ymd)) {
			return this.mxEntries.get(ymd)!
		}

		const mxEntry = new MXEntry(ymd, this.entries.get(ymd))
		this.mxEntries.set(ymd, mxEntry)

		// console.log(ymd, 'created')
		return mxEntry
	}

	clearMXEntries = () => this.mxEntries.clear()

	refreshing = false
	setRefreshing = (_: boolean) => (this.refreshing = _)

	loadingPreviousMonth = false
	setLoadingPreviousMonth = (_: boolean) => (this.loadingPreviousMonth = _)

	item: OtherGraphItem | null = null
	setItem = (_: OtherGraphItem) => (this.item = _)

	lastLoadedMonth: string | null = null
	setLastLoadedMonth = (_: string) => (this.lastLoadedMonth = _)
}
