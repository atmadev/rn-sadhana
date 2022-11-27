import { makeAutoObservable } from 'mobx'
import { OtherGraphItem } from 'shared/types'
import { trimmed } from 'shared/utils'
import { graphStore } from './GraphStore'
import { userStore } from './UserStore'

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

	addItems = (_: OtherGraphItem[], reset?: true) => {
		_.forEach((item) => {
			userStore.setUser({
				userid: item.user_id,
				user_name: trimmed(item.spiritual_name) ?? trimmed(item.karmic_name),
				user_nicename: item.user_nicename,
				avatar_url: item.avatarUrl,
			})
			const graph = graphStore.graphForUserID(item.user_id)
			graph.setEntries([item])
		})

		this._items = reset ? _ : this.items.concat(_)
	}

	addSearchItems = (_: OtherGraphItem[]) => (this.searchItems = _)

	loadingPage: number | null = null
	setLoadingPage = (_: number | null) => (this.loadingPage = _)

	get refreshing() {
		return this.loadingPage === 0 && this.searchString.length === 0
	}

	showFavorites = false
	toggleFavorites = () => (this.showFavorites = !this.showFavorites)
}

export const otherGraphsStore = new OtherGraphsStore()
