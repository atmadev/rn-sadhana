import { mapValues } from 'lodash'
import { makeAutoObservable } from 'mobx'
import { defaultMaxRounds, parseRounds } from 'utils'
import { monthStringFromYmd } from 'shared/dateUtil'
import { Entry, YMD } from 'shared/types'
import { MXEntry } from './MXEntry'
import { userStore } from './UserStore'

export class MXGraph {
	userID: string

	constructor(userID: string) {
		this.userID = userID
		makeAutoObservable(this, { userID: false })
	}

	entries = new Map<YMD, Entry>()
	setEntries = (_: Entry[]) => {
		_.forEach((_) => this.entries.set(_.date, _))
	}

	get entriesByMonth() {
		const entries = {} as { [month: string]: Entry[] }

		this.entries.forEach((entry) => {
			const month = monthStringFromYmd(entry.date)
			const array = entries[month] ?? []
			array.push(entry)
			entries[month] = array
		})

		return entries
	}

	get maxRoundsByMonth() {
		return mapValues(this.entriesByMonth, (value) =>
			value.reduce(
				(previous, current) => Math.max(parseRounds(current).all, previous),
				defaultMaxRounds,
			),
		)
	}

	get lastEntry() {
		return this.entries.size > 0
			? Array.from(this.entries.values()).reduce((prev, current) =>
					prev.date > current.date ? prev : current,
			  )
			: null
	}

	mxEntries = new Map<YMD, MXEntry>()
	getMXEntry = (ymd: YMD) => {
		if (this.mxEntries.has(ymd)) {
			return this.mxEntries.get(ymd)!
		}

		const mxEntry = new MXEntry(ymd, this.entries.get(ymd))
		this.mxEntries.set(ymd, mxEntry)

		return mxEntry
	}

	clearMXEntries = () => this.mxEntries.clear()

	refreshing = false
	setRefreshing = (_: boolean) => (this.refreshing = _)

	loadingPreviousMonth = false
	setLoadingPreviousMonth = (_: boolean) => (this.loadingPreviousMonth = _)

	lastLoadedMonth: string | null = null
	setLastLoadedMonth = (_: string) => (this.lastLoadedMonth = _)

	get favorite() {
		return userStore.favorites.some((user) => user.userid === this.userID)
	}

	toggleFavorite = () => {
		userStore.setUserFavorite(this.userID, !this.favorite)
	}
}
