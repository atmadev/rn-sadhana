import { makeAutoObservable } from 'mobx'
import { OtherGraphItem } from 'shared/types'

class OtherGraphsStore {
	constructor() {
		makeAutoObservable(this)
	}

	country = 'all'
	setCountry = (c: string) => (this.country = c)

	city = ''
	setCity = (c: string) => (this.city = c)

	searchString = ''
	setSearchString = (s: string) => (this.searchString = s)

	pageNumber = 0
	setPageNumber = (n: number) => (this.pageNumber = n)

	items: OtherGraphItem[] = []
	addItems = (i: OtherGraphItem[]) => this.items.push(...i)
	resetItems = (i: OtherGraphItem[]) => (this.items = i)
}

export const otherGraphsStore = new OtherGraphsStore()
