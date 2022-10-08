import * as db from 'services/localDB'
import * as vs from 'services/network/vs'
import { utcStringFromDate } from 'shared/dateUtil'
import { graphStore } from 'store/GraphStore'
import { userStore } from 'store/UserStore'
import { vsRunSafe } from './vs'

export const fetchMyRecentEntries = async () => {
	try {
		graphStore.my!.setRefreshing(true)
		const myID = userStore.myID!
		let modified_since = await db.entryUpdatedDateForUser(userStore.myID!)

		if (!modified_since) {
			const date = new Date()
			date.setUTCFullYear(date.getUTCFullYear() - 1)
			modified_since = utcStringFromDate(date)
		}
		const entriesResult = await vsRunSafe(() => vs.entries(myID, { modified_since }))
		if (!entriesResult.success) return false

		const { entries } = entriesResult.data
		graphStore.setEntries(entries, myID)
		await db.insertEntries(entries)

		const maxUpdatedDate = entries.reduce((a, b) => (a > b.updated_at ? a : b.updated_at), '')
		if (maxUpdatedDate !== '') await db.setEntryUpdatedDateForUser(myID, maxUpdatedDate)

		return true
	} catch (e) {
		console.log('fetchMyRecentEntries', e)
		return false
	} finally {
		graphStore.my!.setRefreshing(false)
	}
}

export const fetchLocalEntries = async () => {
	const localEntries = await db.entries(userStore.myID!)
	graphStore.setEntries(localEntries, userStore.myID!)
}
