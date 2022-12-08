import { makeAutoObservable } from 'mobx'
import { OtherGraphItem } from 'shared/types'

class SearchGraphStore {
	constructor() {
		makeAutoObservable(this)
	}

	country = 'all'
	setCountry = (_: string) => (this.country = _)

	city = ''
	setCity = (_: string) => (this.city = _)

	searchString = ''
	setSearchString = (_: string) => {
		this.searchString = _

		if (_.length === 0) {
			this.setItems([], Date.now())
			this.searchingTime = null
		}
	}

	clear = () => this.setSearchString('')

	items: OtherGraphItem[] = []
	setItems = (_: OtherGraphItem[], searchTime: number) => {
		if (this.searchTime > searchTime) return
		this.items = _
		this.searchTime = searchTime
	}

	searchTime = 0

	searchingTime: number | null = null
	setSearchingTime = (_: number) => (this.searchingTime = _)
	removeSearchingTime = (_: number) => {
		if (_ === this.searchingTime) this.searchingTime = null
	}
}

export const searchGraphStore = new SearchGraphStore()
