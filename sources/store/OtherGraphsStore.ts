import { makeAutoObservable } from 'mobx'
import { OtherGraphItem } from 'shared/types'

class OtherGraphsStore {
	constructor() {
		makeAutoObservable(this)
	}

	country = 'all'
	setCountry = (_: string) => (this.country = _)

	city = ''
	setCity = (_: string) => (this.city = _)

	searchString = ''
	setSearchString = (_: string) => (this.searchString = _)

	pageNumber = 0
	setPageNumber = (_: number) => (this.pageNumber = _)

	private _items: OtherGraphItem[] = []
	private searchItems: OtherGraphItem[] = []
	get items() {
		return this.searchString.length > 0 ? this.searchItems : this._items
	}

	addItems = (_: OtherGraphItem[], reset?: true) => (this._items = reset ? _ : this.items.concat(_))
	addSearchItems = (_: OtherGraphItem[]) => (this.searchItems = _)

	loadingPage: number | null = null
	setLoadingPage = (_: number | null) => (this.loadingPage = _)

	get refreshing() {
		return this.loadingPage === 0 && this.searchString.length === 0
	}
}

export const otherGraphsStore = new OtherGraphsStore()
