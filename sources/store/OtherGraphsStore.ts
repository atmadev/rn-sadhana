import { makeAutoObservable } from 'mobx'
import { OtherGraphItem } from 'types'

class OtherGraphsStore {
	constructor() {
		makeAutoObservable(this)
	}

	pageNumber = 0
	setPageNumber = (_: number) => (this.pageNumber = _)

	items: OtherGraphItem[] = []

	addItems = (items: OtherGraphItem[], reset?: true) => {
		this.items = reset ? items : this.items.concat(items)
	}

	loadingPage: number | null = null
	setLoadingPage = (_: number | null) => (this.loadingPage = _)

	get refreshing() {
		return this.loadingPage === 0
	}

	showFavorites = false
	toggleFavorites = () => (this.showFavorites = !this.showFavorites)
}

export const otherGraphsStore = new OtherGraphsStore()
